import requests
import base64
import numpy as np
from PIL import Image
import io

# Create a dummy image for testing
def create_dummy_image():
    # Create a 300x300 grayscale image
    image_array = np.random.rand(300, 300) * 255
    image = Image.fromarray(image_array.astype('uint8'), 'L')
    
    # Convert to base64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def test_api():
    # Create a dummy image
    dummy_image = create_dummy_image()
    
    # Test health endpoint
    try:
        health_response = requests.get('http://localhost:5000/health')
        print(f"Health check: {health_response.status_code} - {health_response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Test prediction endpoint
    try:
        predict_response = requests.post(
            'http://localhost:5000/predict',
            json={'image': dummy_image}
        )
        print(f"Prediction: {predict_response.status_code} - {predict_response.json()}")
    except Exception as e:
        print(f"Prediction failed: {e}")

if __name__ == '__main__':
    test_api()