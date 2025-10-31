// API service for defect detection
import { ApiError, createTimeoutPromise } from '../utils/errorUtils';

const API_BASE_URL = 'http://localhost:5001';

interface PredictionResult {
  isDefective: boolean;
  confidence: number;
}

export class DefectDetectionApi {
  // Health check endpoint
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Predict defect in an image
  static async predictDefect(imageBase64: string): Promise<PredictionResult> {
    try {
      const request = fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      
      // Add timeout of 30 seconds
      const response = await createTimeoutPromise(request, 30000);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`, 
          response.status
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError('Failed to analyze image. Please try again.');
      }
    }
  }
}