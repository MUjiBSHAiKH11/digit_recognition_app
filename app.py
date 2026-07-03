from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import base64

app = Flask(__name__)

# Load the trained CNN model
model = load_model("cnn_model2.keras")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json["image"]

    # Remove the header from the Base64 string
    image = data.split(",")[1]

    # Decode Base64 to bytes
    image = base64.b64decode(image)

    # Convert bytes to NumPy array
    np_array = np.frombuffer(image, np.uint8)

    # Decode image
    img = cv2.imdecode(np_array, cv2.IMREAD_GRAYSCALE)

    # Resize image to 28x28
    img = cv2.resize(img, (28, 28))

    # Normalize
    img = img.astype("float32") / 255.0

    # Reshape for CNN
    img = img.reshape(1, 28, 28, 1)

    # Predict
    prediction = model.predict(img)

    digit = int(np.argmax(prediction))
    confidence = float(np.max(prediction) * 100)

    return jsonify({
        "digit": digit,
        "confidence": round(confidence, 2)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)