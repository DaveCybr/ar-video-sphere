import { Play, Smartphone, Camera } from 'lucide-react';
import { Button } from './ui/button';

interface ARLandingPageProps {
  onStart: () => void;
}

const ARLandingPage = ({ onStart }: ARLandingPageProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-1.5s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8 text-center max-w-md">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 shadow-2xl">
            <Camera className="h-14 w-14 text-primary" />
          </div>
          <div className="absolute -inset-4 rounded-[2rem] animate-pulse-glow opacity-50" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary text-glow">AR</span>{' '}
            <span className="text-foreground">Video Player</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Experience augmented reality video playback using marker detection
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3 w-full">
          <div className="glass-panel rounded-xl p-4 flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Mobile Optimized</p>
              <p className="text-xs text-muted-foreground">Best experienced on mobile devices</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Auto-Play Video</p>
              <p className="text-xs text-muted-foreground">Video plays when HIRO marker is detected</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          <Play className="h-5 w-5 mr-2" />
          Start AR Experience
        </Button>

        {/* Note */}
        <p className="text-xs text-muted-foreground/60">
          Camera access will be required
        </p>
      </div>
    </div>
  );
};

export default ARLandingPage;
