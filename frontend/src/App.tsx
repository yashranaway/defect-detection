import React, { useEffect, useState } from 'react';
import './App.css';
import DefectDetectionDashboard from './components/DefectDetectionDashboard';
import { checkBackendReachable } from './utils/healthCheck';

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
      <div className="container">
        <DefectDetectionDashboard />
      </div>
    </div>
  );
}

export default App;