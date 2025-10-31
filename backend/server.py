from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
model_path = os.path.join(os.path.dirname(__file__), '..', 'CastingModel.h5')
model = tf.keras.models.load_model(model_path)

# Constants
IMAGE_SIZE = (300, 300)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image from the request
        image_data = request.json['image']
        
        # Remove the data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decode the base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess the image - match the exact preprocessing from the notebook
        # The notebook uses load_img with color_mode='grayscale' and target_size=(300, 300)
        # IMPORTANT: The model was trained on images with pixel values in the 0-255 range, NOT normalized to 0-1
        image = image.convert('L')  # Convert to grayscale
        image = image.resize(IMAGE_SIZE)  # Resize to 300x300
        image_array = np.array(image)
        # DO NOT normalize to 0-1 range - keep as 0-255 range as in training
        image_array = np.expand_dims(image_array, axis=0)
        image_array = np.expand_dims(image_array, axis=-1)  # Add channel dimension
        
        # Make prediction
        prediction = model.predict(image_array, verbose=0)
        raw_confidence = float(prediction[0][0])
        
        # The model was trained with classes ['def_front', 'ok_front']
        # So prediction > 0.5 means 'ok_front' (class 1) - NOT defective
        # And prediction <= 0.5 means 'def_front' (class 0) - defective
        is_defective = raw_confidence <= 0.5
        
        # For display confidence, we want to show how confident the model is in its prediction
        # If defective (raw_confidence <= 0.5), confidence = 1 - raw_confidence
        # If not defective (raw_confidence > 0.5), confidence = raw_confidence
        display_confidence = 1 - raw_confidence if is_defective else raw_confidence
        
        return jsonify({
            'isDefective': is_defective,
            'confidence': display_confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)