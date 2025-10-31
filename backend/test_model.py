import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Load the model
model_path = os.path.join(os.path.dirname(__file__), '..', 'CastingModel.h5')
print(f"Loading model from: {model_path}")

try:
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully!")
    
    # Print model summary
    print("\nModel Summary:")
    model.summary()
    
    # Test with a dummy image
    print("\nTesting with dummy image...")
    dummy_image = np.random.rand(1, 300, 300, 1).astype('float32')
    prediction = model.predict(dummy_image, verbose=0)
    print(f"Prediction result: {prediction}")
    print("Test completed successfully!")
    
except Exception as e:
    print(f"Error loading model: {e}")