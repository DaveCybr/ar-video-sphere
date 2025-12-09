import { useEffect, useRef, useState, useCallback } from 'react';

interface ARSceneProps {
  onMarkerFound: () => void;
  onMarkerLost: () => void;
  isMuted: boolean;
}

const ARScene = ({ onMarkerFound, onMarkerLost, isMuted }: ARSceneProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const markerVisibleRef = useRef(false);

  const handleMarkerFound = useCallback(() => {
    if (!markerVisibleRef.current) {
      markerVisibleRef.current = true;
      onMarkerFound();
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [onMarkerFound]);

  const handleMarkerLost = useCallback(() => {
    if (markerVisibleRef.current) {
      markerVisibleRef.current = false;
      onMarkerLost();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [onMarkerLost]);

  useEffect(() => {
    const loadScripts = async () => {
      // Check if MindAR is already loaded
      if ((window as Window & { MINDAR?: unknown }).MINDAR) {
        setIsSceneReady(true);
        return;
      }

      // Load A-Frame 1.2.0 (compatible with MindAR)
      if (!document.querySelector('script[src*="aframe"]')) {
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.2.0/aframe.min.js';
        aframeScript.async = false;
        
        await new Promise((resolve, reject) => {
          aframeScript.onload = resolve;
          aframeScript.onerror = reject;
          document.head.appendChild(aframeScript);
        });
      }

      // Load MindAR image tracking
      if (!document.querySelector('script[src*="mindar-image"]')) {
        const mindarScript = document.createElement('script');
        mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js';
        mindarScript.async = false;
        
        await new Promise((resolve, reject) => {
          mindarScript.onload = resolve;
          mindarScript.onerror = reject;
          document.head.appendChild(mindarScript);
        });
      }

      // Load MindAR A-Frame integration
      if (!document.querySelector('script[src*="mindar-image-aframe"]')) {
        const mindarAframeScript = document.createElement('script');
        mindarAframeScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
        mindarAframeScript.async = false;
        
        await new Promise((resolve, reject) => {
          mindarAframeScript.onload = resolve;
          mindarAframeScript.onerror = reject;
          document.head.appendChild(mindarAframeScript);
        });
      }

      // Wait for scripts to initialize
      setTimeout(() => setIsSceneReady(true), 500);
    };

    loadScripts().catch(console.error);

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!isSceneReady || !containerRef.current) return;

    // Create the AR scene with MindAR image tracking
    // Using HIRO marker image as the target
    const sceneHTML = `
      <a-scene
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/nicofirst1/hiro-marker@main/hiro.mind; uiScanning: #scanning-overlay; uiLoading: no;"
        color-space="sRGB"
        renderer="colorManagement: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"
      >
        <a-assets>
          <video
            id="ar-video-asset"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            preload="auto"
            loop="true"
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
            muted
          ></video>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-video
            src="#ar-video-asset"
            width="1.6"
            height="0.9"
            position="0 0 0"
            rotation="0 0 0"
          ></a-video>
        </a-entity>
      </a-scene>
      <div id="scanning-overlay" style="display: none;"></div>
    `;

    containerRef.current.innerHTML = sceneHTML;

    // Get video reference
    const videoEl = document.getElementById('ar-video-asset') as HTMLVideoElement;
    if (videoEl) {
      videoRef.current = videoEl;
      videoEl.muted = isMuted;
    }

    // Set up target events
    const setupTargetEvents = () => {
      const target = document.querySelector('[mindar-image-target]');
      if (target) {
        target.addEventListener('targetFound', handleMarkerFound);
        target.addEventListener('targetLost', handleMarkerLost);
      }
    };

    // Wait for scene to be ready
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('renderstart', setupTargetEvents);
      // Also try immediate setup in case scene is already loaded
      setTimeout(setupTargetEvents, 1000);
    }

    return () => {
      const target = document.querySelector('[mindar-image-target]');
      if (target) {
        target.removeEventListener('targetFound', handleMarkerFound);
        target.removeEventListener('targetLost', handleMarkerLost);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isSceneReady, handleMarkerFound, handleMarkerLost, isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!isSceneReady) {
    return null;
  }

  return <div ref={containerRef} className="ar-fullscreen" />;
};

export default ARScene;
