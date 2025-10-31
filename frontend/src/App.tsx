import React, { useEffect, useState } from 'react';
import './App.css';
import DefectDetectionDashboard from './components/DefectDetectionDashboard';
import { checkBackendReachable } from './utils/healthCheck';
import { Voronoi } from '@paper-design/shaders-react';

function App() {
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendReachable();
      setBackendStatus(isHealthy);
    };

    checkHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="background-container">
        <Voronoi
          width="100vw"
          height="100vh"
          colors={["#ffffff"]}
          colorGlow="#ffffff"
          colorGap="#000000"
          stepsPerColor={1}
          distortion={0.5}
          gap={0.03}
          glow={0.8}
          speed={0.1}
          scale={0.5}
        />
      </div>
      <header className="App-header">
        <h1 className="App-title">Casting Defect Detection</h1>
        <p className="App-description">
          AI-powered quality control for industrial casting products
        </p>
        {backendStatus !== null && (
          <div className={`backend-status ${backendStatus ? 'connected' : 'disconnected'}`}>
            {backendStatus ? 'Backend Connected' : 'Backend Disconnected'}
          </div>
        )}
      </header>
      <main className="container">
        <DefectDetectionDashboard />
      </main>
    </div>
  );
}

export default App;