import { ArrowLeft, Volume2, VolumeX, Info, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ARControlsProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMarkerVisible: boolean;
}

const ARControls = ({ onBack, isMuted, onToggleMute, isMarkerVisible }: ARControlsProps) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Top Controls */}
      <div className="fixed top-0 left-0 right-0 z-50 safe-area-top">
        <div className="flex items-center justify-between p-4">
          {/* Back Button */}
          <Button
            variant="glass-icon"
            size="icon-lg"
            onClick={onBack}
            className="animate-fade-in-up"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Mute Toggle */}
            <Button
              variant="glass-icon"
              size="icon-lg"
              onClick={onToggleMute}
              className={cn(
                "animate-fade-in-up",
                !isMuted && "border-primary/40 shadow-lg shadow-primary/20"
              )}
              style={{ animationDelay: '0.1s' }}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6 text-primary" />
              )}
            </Button>

            {/* Info Button */}
            <Button
              variant="glass-icon"
              size="icon-lg"
              onClick={() => setShowInfo(true)}
              className="animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Info className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Marker Status Indicator */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <div className="p-4">
          <div className={cn(
            "glass-panel rounded-2xl p-4 mx-auto max-w-sm transition-all duration-500",
            isMarkerVisible 
              ? "border-primary/40 shadow-lg shadow-primary/20" 
              : "animate-pulse-glow"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors duration-300",
                isMarkerVisible ? "bg-primary glow-subtle" : "bg-muted-foreground"
              )} />
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isMarkerVisible ? "text-primary text-glow" : "text-foreground"
                )}>
                  {isMarkerVisible ? 'Target Detected!' : 'Scanning for target image...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isMarkerVisible 
                    ? 'Video is now playing' 
                    : 'Point camera at the card image to start'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanning Animation Overlay */}
      {!isMarkerVisible && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 border-[3px] border-primary/20 m-8 rounded-3xl">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-primary rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-primary rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-primary rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-primary rounded-br-3xl" />
            
            {/* Scanning Line */}
            <div className="absolute inset-x-4 top-0 h-full overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">AR Video Player</h2>
              <Button
                variant="glass-icon"
                size="icon"
                onClick={() => setShowInfo(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h3 className="text-foreground font-medium">How to Use</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Allow camera access when prompted</li>
                  <li>Point your camera at the target card image</li>
                  <li>Video will play automatically on the target</li>
                  <li>Use the mute button to toggle audio</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-foreground font-medium">Target Image</h3>
                <p className="mb-2">
                  Point your camera at this card image:
                </p>
                <img 
                  src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/card.png"
                  alt="Target card"
                  className="w-full rounded-lg border border-border/30"
                />
              </div>

              <div className="pt-2 border-t border-border/20">
                <p className="text-xs text-center text-muted-foreground/60">
                  Powered by A-Frame & MindAR
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ARControls;
