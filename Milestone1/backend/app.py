from flask import Flask, jsonify, session, request
import requests
from flask_cors import CORS
import hashlib
from models import db, USERS, USER_STOCKS
from sqlalchemy.pool import NullPool
import oracledb

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["SECRET_KEY"] = "wRm$$4e&4E!"

un = 'ADMIN'
pw = '.5wBPW3qSwJuWC!'
dsn = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g70802e41303b93_debuggingdollarsdatabase_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

pool = oracledb.create_pool(user=un, password=pw,
                            dsn=dsn)

app.config['SQLALCHEMY_DATABASE_URI'] = 'oracle+oracledb://'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def api_root():
    return jsonify(message="Debugging Dollars API is running")

#API endpoint for stock details for specific symbol
@app.route('/stockinfo/<symbol>')
def stockinfo_for_symbol(symbol):
    # call function with API call to AV
    daily_series = av_api(symbol)

    # Extract the last 5 days of data
    last_5_days = list(daily_series.keys())[:5]
    data_for_frontend = []
    for date in last_5_days:
        day_data = daily_series[date]
            # Adjust the structure here to match the desired output
        formatted_data = [
            date, 
                {
                    "1. open": round(float(day_data["1. open"]),2),
                    "2. high": round(float(day_data["2. high"]),2),
                    "3. low": round(float(day_data["3. low"]),2),
                    "4. close": round(float(day_data["4. close"]),2),
                    "5. volume": int(day_data["5. volume"])
                }
            ]
        data_for_frontend.append(formatted_data)

    return jsonify(data_for_frontend)

#API endpoint to request portfolio overview and total value of portfolio
@app.route('/<userID>')
def portfolio_overview(userID):
    portfolio= USER_STOCKS.query.filter_by(USERID = userID).all()
    
    if not portfolio:
        return jsonify({"error": "No stocks found for the user"}), 404

    totalvalue = 0
    symbols = {}

    for stock in portfolio:
        symbol = portfolio.StockSymbol
        quantity = portfolio.Quantity
        av_data = av_api(symbol)
        
        if not av_data:
            return jsonify({"error": "Failed to get data for symbol: " + symbol}), 500
        
        # The first element is the most recent
        latest_closing_price = float(av_data[list(av_data.keys())[0]]["4. close"])
        value_for_symbol = round(latest_closing_price * quantity,2)
        totalvalue += value_for_symbol

        # Directly assign the non-list values for quantity and value
        symbols[symbol] = {"quantity": quantity, "value": value_for_symbol}
        
    totalvalue = round(totalvalue, 2)

    response = {
        "total_value": totalvalue,
        "symbols": symbols
    }
    
    # Return the total value and the symbol_values dictionary directly within a list
    return jsonify(response)

@app.route("/handleLogin", methods=["POST"])
def handle_login():
    data = request.get_json()
    username = data.get("username")
    password = hash_pw(data.get("password"))
    
    try: 
        #use parameters for more security
        user = USERS.query.filter_by(USERNAME = username , PASSWORD = password).first()

        if user:
            # access user information based on table structure
            username = user.USERNAME
            session["user_id"] = user.USERID
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Username or Password incorrect"}), 403
    except Exception as e:
        return jsonify({"message": "Error with login: {}".format(str(e))}), 500

@app.route("/handleRegister", methods=["POST"])
def handle_register():
    data = request.get_json()
    username = data.get("username")
    password = hash_pw(data.get("password"))
    
    try: 
        # Check if the user already exists
        user = USERS.query.filter_by(USERNAME = username).first()
        
        if user:
            return jsonify({"message": "Account already exists. Go to login"}), 403
        else:
            # Insert new user
            new_user = USERS(USERNAME=username, PASSWORD = password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "Account created. Go to login."}), 200

    except Exception as e:
        return jsonify({"message": "Error with registration: {}".format(str(e))}), 500

@app.route("/handleLogout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."}), 200

@app.route('/removeStock', methods=['POST'])
def remove_or_update_stock():
    data = request.get_json()
    stock_symbol = data.get('stock_symbol')
    quantity_to_remove = int(data.get('quantity'))

    # for testing purposes
    user_id = 2
    if not user_id:
        return jsonify({"message": "User is not logged in"}), 401

    try:
        # Check if the stock already exists in the portfolio
        stock = USER_STOCKS.query.filter_by(USERID=user_id, STOCKSYMBOL=stock_symbol).first()

        if stock:
            # Check if the quantity to remove is less than or equal to the current stock quantity
            if quantity_to_remove <= stock.Quantity:
                # Update the stock quantity
                stock.QUANTITY -= quantity_to_remove

                # If the new quantity is 0, remove the stock entry
                if stock.QUANTITY <= 0:
                    db.session.delete(stock)
                    db.session.commit()
                    return jsonify({"message": "Stock removed from portfolio"}), 200
                else:
                    db.session.commit()
                    return jsonify({"message": "Stock quantity updated successfully"}), 200
            else:
                # Trying to remove more stock than is available
                db.session.delete(stock)  # Removing the stock entry as per requirements
                db.session.commit()
                return jsonify({"message": "Requested quantity exceeds stock in portfolio. Stock removed."}), 400
        else:
            # Stock does not exist in the user's portfolio
            return jsonify({"message": "Stock not found in portfolio"}), 404

    except Exception as e:
        return jsonify({"message": "Error updating portfolio: {}".format(str(e))}), 500

@app.route('/addStock', methods=['POST'])
def add_or_update_stock():
    data = request.get_json()
    stock_symbol = data.get('stock_symbol')
    quantity = int(data.get('quantity'))

    # for testing purposes
    user_id = 2
    if not user_id:
        return jsonify({"message": "User is not logged in"}), 401

    try:
        # Check if the stock already exists in the portfolio
        stock= USER_STOCKS.query.filter_by(USERID = user_id, STOCKSYMBOL = stock_symbol).first()

        if stock:
            # Stock already exists, update the quantity
            stock.Quantity += quantity
            db.session.commit()
        else:
        # Stock does not exist, insert a new entry
            new_stock = USER_STOCKS(USERID = user_id, STOCKSYMBOL = stock_symbol, QUANTITY = quantity)
            db.session.add(new_stock)
            db.session.commit()
            return jsonify({"message": "Portfolio updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Error updating portfolio: {}".format(str(e))}), 500

@app.route("/modifyPortfolio/<userID>", methods = ["POST"])
def modify_portfolio(userID):
    data = request.get_json()
    stock_symbol = data.get('stock_symbol').upper().replace(" ","") 
    quantity = int(data.get('quantity'))
    operation = data.get('operation')

    user_id = userID
    if not user_id:
        return jsonify({"message": "User is not logged in"}), 401

    if not av_api(stock_symbol):
        return jsonify({"message": "Invalid stock symbol"}), 400
    
    try:
        # Check if the stock already exists in the portfolio
        stock = USER_STOCKS.query.filter_by(USERID=user_id, STOCKSYMBOL=stock_symbol).first()

        if operation.upper() == "ADD":
            if stock:
                # Stock already exists, update the quantity
                stock.QUANTITY += quantity
            else:
                # Stock does not exist, insert a new entry
                stock = USER_STOCKS(USERID=user_id, STOCKSYMBOL=stock_symbol, QUANTITY=quantity)
                db.session.add(stock)
        elif operation.upper() == "REMOVE":
            if stock:
                # Check if the quantity to remove is less than or equal to the current stock quantity
                if quantity <= stock.QUANTITY:
                    stock.QUANTITY -= quantity
                    # If the new quantity is 0, remove the stock entry
                    if stock.QUANTITY == 0:
                        db.session.delete(stock)
                else:
                    # Trying to remove more stock than is available
                    return jsonify({"message": "Requested quantity exceeds stocks in portfolio"}), 400
            else:
                # Stock does not exist in the user's portfolio
                return jsonify({"message": "Stock not found in portfolio"}), 404
        else:
            return jsonify({"message": "Invalid operation"}), 400

        db.session.commit()
        return jsonify({"message": "Portfolio updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Error updating portfolio: {}".format(str(e))}), 500

#Function with API request to AV
def av_api(symbol):
    #Requests daily series (100 past days). Symbol for specific stock,API key and response format as parameters 
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey=5KFQLJAEXPPU6DJ9&outputsize=compact&datatype=json"
    response = requests.get(url)
    if response.status_code == 200:
        symbol_data = response.json()
        # Extract the "Time Series (Daily)" part of the response
        daily_series = symbol_data.get("Time Series (Daily)", {})
        return daily_series
    else:
        return False


def hash_pw(string):
    hash = hashlib.sha1()
    hash.update(string.encode())
    return hash.hexdigest()

if __name__ == '__main__':
    app.run(debug=True)