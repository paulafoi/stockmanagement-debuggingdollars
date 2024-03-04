from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
                    "5. volume": round(float(day_data["5. volume"]),2)
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


#Function with API request to AV
def av_api(symbol):
    #Requests daily series (100 past days). Symbol for specific stock,API key and response format as parameters 
    url = f"http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey=5KFQLJAEXPPU6DJ9&outputsize=compact&datatype=json"
    response = requests.get(url)
    if response.status_code == 200:
        symbol_data = response.json()
        # Extract the "Time Series (Daily)" part of the response
        daily_series = symbol_data.get("Time Series (Daily)", {})
        return daily_series
    else:
        print(f"Failed to get AV data: {response.status_code}")

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