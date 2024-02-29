from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def api_root():
    return jsonify(message="Debugging Dollars API is running")

@app.route("/<userID>")
def stock_overview(userID):
    user_data = user_database()
    if userID not in user_data:
        return jsonify({"error": "Invalid user ID. Please create an account <a href='/signup'> here </a>"}), 404
    else: 
        user_info = user_data.get(userID)
    return jsonify(user_info)

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
                    "1. open": day_data["1. open"],
                    "2. high": day_data["2. high"],
                    "3. low": day_data["3. low"],
                    "4. close": day_data["4. close"],
                    "5. volume": day_data["5. volume"]
                }
            ]
        data_for_frontend.append(formatted_data)

    return jsonify(data_for_frontend)

@app.route('/portfoliovalue/<userID>')
def portfoliovalue(userID):
    user_data = user_database()
    if userID not in user_data:
        return jsonify({"error": "Invalid user ID. Please create an account <a href='/signup'> here </a>"}), 404
    
    portfolio = user_data[userID]
    totalvalue = 0
    symbol_values = {}

    for symbol,quantity in portfolio.items():
        av_data = av_api(symbol)
        
        if not av_data:
            return jsonify({"error": "Failed to get data for symbol: " + symbol}), 500
        # Convert the daily series to the desired list format for the frontend
        data_for_frontend = [[date, data] for date, data in av_data.items()]
        # The first element is the most recent
        latest_closing_price = float(data_for_frontend[0][1]["4. close"])
        value_for_symbol = latest_closing_price * quantity
        symbol_values[symbol] = [value_for_symbol]
        totalvalue += value_for_symbol
    
    return jsonify({"Total Portfolio Value": totalvalue, "Portfolio Compositon" : symbol_values})



#Function with API request to AV
def av_api(symbol):
    url = f"http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey=5KFQLJAEXPPU6DJ9&outputsize=compact&datatype=json"
    response = requests.get(url)
    if response.status_code == 200:
        symbol_data = response.json()
        # Extract the "Time Series (Daily)" part of the response
        daily_series = symbol_data.get("Time Series (Daily)", {})
        return daily_series
    else:
        print(f"Failed to get data: {response.status_code}")




def user_database():
    return { 
        'user1': { 
            'AAPL': 10, 

            'GOOGL': 5, 

            'AMZN': 3 
        }, 
    } 

if __name__ == '__main__':
    app.run(debug=True)