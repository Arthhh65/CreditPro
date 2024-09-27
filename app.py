from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Route to serve the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Example API route (for handling login, transactions, etc.)
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    # Example static data for transactions
    transactions = [
        {"id": 1, "date": "2024-09-27", "amount": 200.0, "description": "Purchase A"},
        {"id": 2, "date": "2024-09-26", "amount": 150.0, "description": "Purchase B"}
    ]
    return jsonify(transactions)

if __name__ == '__main__':
    app.run(debug=True)
