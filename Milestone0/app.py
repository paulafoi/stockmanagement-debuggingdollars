from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def homepage():
    return """<h1>Welcome to Debugging Dollars!</h1>
    <p> Please choose which user you are:</p>
    <div>
    <ul>User1: Click <a href='/stockinfo/user1'>here</a></ul>
    </div>"""

@app.route("/stockinfo/<userID>")
def stock_overview(userID):
    user_data = user_database()
    if userID not in user_data:
        return jsonify({"error": "Invalid user ID. Please create an account <a href='/signup'> here </a>"}), 404
    else: 
        user_info = user_data.get(userID)
    return jsonify(user_info)


@app.route('/stockinfo/<userID>/<symbol>')
def symbol_info(userID,symbol):
    pass


def user_database():
    return { 
        'user1': { 
            'AAPL': 10, 

            'GOOGL': 5, 

            'AMZN': 3 
        }, 

        'user2': { 
            'AAPL': 5, 

            'GOOGL': 3, 

            'AMZN': 2 
        } 
    } 

if __name__ == '__main__':
    app.run(debug=True)