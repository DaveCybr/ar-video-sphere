import { useState, useCallback, useEffect } from 'react';
import ARScene from '@/components/ARScene';
import ARControls from '@/components/ARControls';
import ARLoadingScreen from '@/components/ARLoadingScreen';
import ARLandingPage from '@/components/ARLandingPage';

type AppState = 'landing' | 'loading' | 'requesting' | 'ar' | 'error';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const startAR = useCallback(async () => {
    setAppState('requesting');
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Stop the test stream - AR.js will handle its own
      stream.getTracks().forEach(track => track.stop());
      
      setAppState('loading');
      
      // Small delay to show loading state
      setTimeout(() => {
        setAppState('ar');
      }, 1500);
      
    } catch (error) {
      console.error('Camera access error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Unable to access camera. Please check permissions.'
      );
      setAppState('error');
    }
  }, []);

  const handleBack = useCallback(() => {
    setAppState('landing');
    setIsMarkerVisible(false);
  }, []);

  const handleMarkerFound = useCallback(() => {
    setIsMarkerVisible(true);
  }, []);

  const handleMarkerLost = useCallback(() => {
    setIsMarkerVisible(false);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMessage('');
    startAR();
  }, [startAR]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any AR.js related elements
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.srcObject) {
          (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      });
    };
  }, []);

  if (appState === 'landing') {
    return <ARLandingPage onStart={startAR} />;
  }

  if (appState === 'loading' || appState === 'requesting') {
    return <ARLoadingScreen status={appState} />;
  }

  if (appState === 'error') {
    return (
      <ARLoadingScreen 
        status="error" 
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="ar-fullscreen">
      <ARScene
        onMarkerFound={handleMarkerFound}
        onMarkerLost={handleMarkerLost}
        isMuted={isMuted}
      />
      <ARControls
        onBack={handleBack}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isMarkerVisible={isMarkerVisible}
      />
    </div>
  );
};

export default Index;
