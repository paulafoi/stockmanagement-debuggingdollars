from flask import Flask, jsonify, session, request
import requests
from flask_cors import CORS
import hashlib
import oracledb

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["SECRET_KEY"] = "wRm$$4e&4E!"

un = 'MYOWNSH'
cs = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g70802e41303b93_debuggingdollarsdb_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
pw = 'sF3fh_z8phiqTOll'

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
    user_data = user_database()
    if userID not in user_data:
        return jsonify({"error": "Invalid user ID. Please create an account <a href='/signup'> here </a>"}), 404
    
    portfolio = user_data[userID]
    totalvalue = 0
    symbols = {}

    for symbol, quantity in portfolio.items():
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
        with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
            with connection.cursor() as cursor:
                #use parameters for more security
                query_selectuser = f'select user_id, username from users WHERE username = :username AND password = :password'
                cursor.execute(query_selectuser, [username, password])
                user = cursor.fetchone()

                if user:
                    # access user information based on table structure
                    session["username"] = user[0]
                    session["user_id"] = user[1]
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
        with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
            with connection.cursor() as cursor:
                # Check if the user already exists
                query_select_user = f"SELECT * FROM users WHERE username = :username"
                cursor.execute(query_select_user, [username])
                user = cursor.fetchone()

                if user:
                    return jsonify({"message": "Account already exists. Go to login"}), 403
                else:
                    # Insert new user
                    query_insert_user = "INSERT INTO users (username, password) VALUES (:username, :password)"
                    cursor.execute(query_insert_user, [username, password])
                    connection.commit()  # Don't forget to commit the transaction
                    
                    return jsonify({"message": "Account created. Go to login."}), 200

    except Exception as e:
        return jsonify({"message": "Error with registration: {}".format(str(e))}), 500

@app.route("/handleLogout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."}), 200


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
        print(f"Failed to get AV data: {response.status_code}")


def hash_pw(string):
    hash = hashlib.sha1()
    hash.update(string.encode())
    return hash.hexdigest()

if __name__ == '__main__':
    app.run(debug=True)