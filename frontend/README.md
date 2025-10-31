# Defect Detection Dashboard

A clean, modern web application for detecting defects in casting products using a deep learning model.

## Features

- **Clean Black & White Design**: Minimalist interface with paper-like shaders
- **Drag & Drop Upload**: Intuitive image uploading
- **Real-time Analysis**: Instant defect detection with confidence scoring
- **Responsive Layout**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript and Vite
- **Styling**: CSS3 with custom shaders and animations
- **Backend**: Python Flask API with TensorFlow/Keras model
- **Build Tools**: Bun for package management

## Getting Started

1. Start the backend server:
   ```bash
   cd ../backend
   source venv312/bin/activate
   python server.py
   ```

2. Start the frontend development server:
   ```bash
   bun run dev
   ```

3. Open your browser to http://localhost:3000

## Usage

1. Upload an image of a casting product using drag & drop or file browser
2. Click "Analyze Defects" to process the image
3. View results with confidence scoring and quality assessment

## Design Principles

- **Minimalist Aesthetics**: Clean black and white color scheme
- **Paper Shaders**: Subtle textures for depth and realism
- **Intuitive UX**: Simple, straightforward user interface
- **Performance**: Fast loading and responsive interactions