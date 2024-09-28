from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from random import randint
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import re  # For regular expressions

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a secure key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///creditpro.db'  # Using SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Load the pre-trained model
model = tf.keras.models.load_model('credit_scoring_model.h5')

# Initialize the scaler (make sure to save and load it if needed)
scaler = StandardScaler()

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Initialize the database
with app.app_context():
    db.create_all()  # Creates the database and tables
    print("Database and tables created successfully")  # Debug print

# Route to serve the homepage
@app.route('/')
def home():
    return render_template('index.html')

# User Registration Route
@app.route('/register', methods=['POST'])
def register():
    email = request.form['email']
    password = request.form['password']

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"success": False, "message": "Invalid email format"}), 400

    # Validate password length
    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    hashed_password = generate_password_hash(password)

    # Check if the user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "message": "User already exists"}), 400

    # Create a new user
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id

    print("User registered successfully.")  # Debug line
    return jsonify({"success": True, "message": "User registered successfully"}), 200

# User Login Route
@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({"success": True, "message": "Logged in successfully"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# User Logout Route
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

# Route to check if user is logged in
@app.route('/api/check_login')
def check_login():
    if 'user_id' in session:
        return jsonify({"logged_in": True})
    else:
        return jsonify({"logged_in": False})

# Route to fetch user's credit score
@app.route('/api/get_credit_score', methods=['GET'])
def get_credit_score():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "User not logged in"}), 401

    # Simulating a credit score for now (can be replaced with actual logic)
    credit_score = randint(300, 850)  # Random credit score between 300 and 850

    return jsonify({"success": True, "credit_score": credit_score}), 200

# Route to serve the profile page
@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('home'))

    user = User.query.get(session['user_id'])
    return render_template('profile.html', user=user)

# New Route to predict credit score
@app.route('/api/predict_credit_score', methods=['POST'])
def predict_credit_score():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "User not logged in"}), 401

    # Get alternative financial data from request
    data = request.json.get('data')  # Expecting an array of features
    if not data or len(data) != 10:  # Adjust based on your model input
        return jsonify({"success": False, "message": "Invalid input data"}), 400

    # Preprocess the input data
    data = np.array(data).reshape(1, -1)  # Reshape for a single prediction
    data = scaler.transform(data)  # Scale data

    # Make a prediction
    prediction = model.predict(data)
    predicted_class = (prediction > 0.5).astype(int)  # Convert to binary class

    return jsonify({"success": True, "predicted_credit_score": predicted_class[0][0]}), 200

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
