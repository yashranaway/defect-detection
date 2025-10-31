import React, { useState, useRef, useEffect } from 'react';
import { DefectDetectionApi } from '../api/defectDetectionApi';
import { fadeIn } from '../utils/animations';
import { resizeImage, getImageDimensions } from '../utils/imageUtils';
import { formatPercentage } from '../utils/formatUtils';
import './DefectDetectionDashboard.css';

interface PredictionResult {
  isDefective: boolean;
  confidence: number;
}

const DefectDetectionDashboard: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in sections on mount
    if (uploadSectionRef.current) {
      fadeIn(uploadSectionRef.current, 500);
    }
    if (resultsSectionRef.current) {
      fadeIn(resultsSectionRef.current, 500);
    }
  }, []);

  useEffect(() => {
    // Animate results when they appear
    if (prediction && resultsSectionRef.current) {
      const resultCard = resultsSectionRef.current.querySelector('.result-card');
      if (resultCard) {
        fadeIn(resultCard as HTMLElement, 300);
      }
    }
  }, [prediction]);

  const processImage = async (file: File) => {
    try {
      // Get original dimensions
      const originalUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(originalUrl);
      setImageInfo(dimensions);
      URL.revokeObjectURL(originalUrl);
      
      // Resize image if needed (maintain aspect ratio, max 1000px on longest side)
      const resizedUrl = await resizeImage(file, 1000, 1000);
      setSelectedImage(resizedUrl);
      
      // Extract base64 data for API call
      if (resizedUrl.startsWith('data:image')) {
        const base64Data = resizedUrl.split(',')[1];
        if (base64Data) {
          setSelectedImageBase64(base64Data);
        }
      } else {
        setSelectedImageBase64(resizedUrl);
      }
      
      setPrediction(null);
      setError(null);
    } catch (err) {
      setError('Failed to process image: ' + (err as Error).message);
      console.error('Error processing image:', err);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      setError('Please upload an image file');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!selectedImageBase64) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call backend API using our service
      const result = await DefectDetectionApi.predictDefect(selectedImageBase64);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please make sure the backend server is running.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedImageBase64(null);
    setPrediction(null);
    setError(null);
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="upload-section" ref={uploadSectionRef}>
          <div className="section-header">
            <h2>Image Upload</h2>
            <p>Upload a casting product image for defect analysis</p>
          </div>
          
          <div 
            className={`upload-area ${selectedImage ? 'with-image' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {selectedImage ? (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={selectedImage} alt="Preview" />
                </div>
                <div className="preview-overlay">
                  <span>Change Image</span>
                </div>
              </div>
            ) : (
              <div className="upload-prompt">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div className="upload-text">
                  <h3>Drag & Drop Image</h3>
                  <p>or click to browse files</p>
                </div>
              </div>
            )}
          </div>
          
          {imageInfo && (
            <div className="image-info">
              <span>Dimensions: {imageInfo.width} × {imageInfo.height}px</span>
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={analyzeImage}
              disabled={isLoading || !selectedImageBase64}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Analyze Defects'
              )}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={resetAnalysis}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="results-section" ref={resultsSectionRef}>
          <div className="section-header">
            <h2>Analysis Results</h2>
            <p>Detailed defect detection report</p>
          </div>
          
          <div className="results-container">
            {error && (
              <div className="error-card">
                <div className="error-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="error-content">
                  <h3>Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <h3>Analyzing Image</h3>
                <p>Processing with AI model...</p>
              </div>
            )}
            
            {prediction && !isLoading && (
              <div className="result-card">
                <div className={`result-header ${prediction.isDefective ? 'defective' : 'ok'}`}>
                  <div className="result-icon">
                    {prediction.isDefective ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="result-text">
                    <h3>{prediction.isDefective ? 'Defective' : 'Non-Defective'}</h3>
                    <p>Confidence: {formatPercentage(prediction.confidence)}</p>
                  </div>
                </div>
                
                <div className="result-details">
                  <div className="confidence-meter">
                    <div className="confidence-label">
                      <span>Confidence Level</span>
                      <span>{formatPercentage(prediction.confidence)}</span>
                    </div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${prediction.confidence * 100}%`,
                          backgroundColor: prediction.isDefective ? '#ef4444' : '#22c55e'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="result-description">
                    <p>
                      {prediction.isDefective 
                        ? 'Defects detected in the casting product. Please review the manufacturing process and consider quality control measures.' 
                        : 'No defects detected. The casting product meets quality standards and is ready for use.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!prediction && !isLoading && !error && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <h3>No Analysis Yet</h3>
                <p>Upload an image and click "Analyze Defects" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectDetectionDashboard;