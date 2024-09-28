# Import necessary libraries
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras import layers

# -----------------------
# Data Preparation
# -----------------------

# Simulating some alternative financial data (1000 samples, 10 features)
np.random.seed(42)
data = np.random.rand(1000, 10)

# Simulated credit score labels (binary classification: good credit/bad credit)
labels = np.random.randint(2, size=(1000, 1))

# Split the data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)

# Normalize the data using StandardScaler
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

# -----------------------
# Building the Model
# -----------------------

# Build a simple neural network model for credit scoring
model = tf.keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(x_train.shape[1],)),  # Input layer
    layers.Dense(32, activation='relu'),  # Hidden layer
    layers.Dense(1, activation='sigmoid')  # Output layer (binary classification)
])

# Compile the model with optimizer, loss function, and metrics
model.compile(optimizer='adam',
              loss='binary_crossentropy',  # Binary classification
              metrics=['accuracy'])

# -----------------------
# Custom Callback
# -----------------------

# Callback to print accuracy after each epoch
class FitCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(f"Epoch {epoch+1} ended. Accuracy: {logs['accuracy']:.4f}")

# -----------------------
# Training the Model
# -----------------------

# Train the model with the training data
history = model.fit(x_train, y_train, 
                    epochs=20, 
                    batch_size=32, 
                    validation_data=(x_test, y_test), 
                    callbacks=[FitCallback()])

# -----------------------
# Evaluating the Model
# -----------------------

# Evaluate the model on the test set
test_loss, test_acc = model.evaluate(x_test, y_test)

print(f"\nTest Accuracy: {test_acc:.4f}")

# -----------------------
# Save the Model (Optional)
# -----------------------

# Save the model for future use
model.save('credit_scoring_model.h5')
