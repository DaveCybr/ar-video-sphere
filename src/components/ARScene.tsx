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

  const handleMarkerFound = useCallback(() => {
    onMarkerFound();
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [onMarkerFound]);

  const handleMarkerLost = useCallback(() => {
    onMarkerLost();
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [onMarkerLost]);

  useEffect(() => {
    const loadScripts = async () => {
      // Check if already loaded
      if ((window as Window & { AFRAME?: unknown }).AFRAME) {
        setIsSceneReady(true);
        return;
      }

      // Load A-Frame
      if (!document.querySelector('script[src*="aframe"]')) {
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
        aframeScript.async = false;
        
        await new Promise((resolve, reject) => {
          aframeScript.onload = resolve;
          aframeScript.onerror = reject;
          document.head.appendChild(aframeScript);
        });
      }

      // Load AR.js
      if (!document.querySelector('script[src*="aframe-ar"]')) {
        const arjsScript = document.createElement('script');
        arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        arjsScript.async = false;
        
        await new Promise((resolve, reject) => {
          arjsScript.onload = resolve;
          arjsScript.onerror = reject;
          document.head.appendChild(arjsScript);
        });
      }

      // Wait a bit for scripts to initialize
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

    // Create the AR scene HTML
    const sceneHTML = `
      <a-scene
        embedded
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium;"
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
        <a-marker
          preset="hiro"
          emitevents="true"
          smooth="true"
          smoothCount="10"
          smoothTolerance="0.01"
          smoothThreshold="5"
        >
          <a-video
            src="#ar-video-asset"
            width="2"
            height="1.125"
            position="0 0.5 0"
            rotation="-90 0 0"
          ></a-video>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    `;

    containerRef.current.innerHTML = sceneHTML;

    // Get video reference
    const videoEl = document.getElementById('ar-video-asset') as HTMLVideoElement;
    if (videoEl) {
      videoRef.current = videoEl;
      videoEl.muted = isMuted;
    }

    // Set up marker events
    const setupMarkerEvents = () => {
      const marker = document.querySelector('a-marker');
      if (marker) {
        marker.addEventListener('markerFound', handleMarkerFound);
        marker.addEventListener('markerLost', handleMarkerLost);
      }
    };

    // Wait for scene to be ready
    const scene = document.querySelector('a-scene');
    if (scene) {
      if ((scene as HTMLElement & { hasLoaded?: boolean }).hasLoaded) {
        setupMarkerEvents();
      } else {
        scene.addEventListener('loaded', setupMarkerEvents);
      }
    }

    return () => {
      const marker = document.querySelector('a-marker');
      if (marker) {
        marker.removeEventListener('markerFound', handleMarkerFound);
        marker.removeEventListener('markerLost', handleMarkerLost);
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
