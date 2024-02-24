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
def symbol_info(symbol):
    
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey=5KFQLJAEXPPU6DJ9&outputsize=compact&datatype=json"
    response = requests.get(url)
    if response.status_code == 200:
        symbol_data = response.json()
        # Extract the "Time Series (Daily)" part of the response
        daily_series = symbol_data.get("Time Series (Daily)", {})
        
        # Extract the last 5 days of data
        last_5_days = list(daily_series.keys())[:5]
        data_for_frontend = []
        for date in last_5_days:
            day_data = daily_series[date]
            data_for_frontend.append({
                "date": date,
                "open": day_data["1. open"],
                "high": day_data["2. high"],
                "low": day_data["3. low"],
                "close": day_data["4. close"],
                "volume": day_data["5. volume"]
            })
    else:
        print(f"Failed to get data: {response.status_code}")

    return jsonify(data_for_frontend)


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