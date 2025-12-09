import { Loader2, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ARLoadingScreenProps {
  status: 'loading' | 'requesting' | 'error';
  errorMessage?: string;
  onRetry?: () => void;
}

const ARLoadingScreen = ({ status, errorMessage, onRetry }: ARLoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
        {/* Icon */}
        <div className={cn(
          "relative flex items-center justify-center w-24 h-24 rounded-full",
          status === 'error' 
            ? "bg-destructive/10 border border-destructive/20"
            : "bg-primary/10 border border-primary/20"
        )}>
          {status === 'loading' && (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </>
          )}
          {status === 'requesting' && (
            <>
              <Camera className="h-10 w-10 text-primary animate-pulse" />
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </>
          )}
          {status === 'error' && (
            <AlertCircle className="h-10 w-10 text-destructive" />
          )}
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xs">
          {status === 'loading' && (
            <>
              <h2 className="text-xl font-semibold text-foreground">Loading AR Experience</h2>
              <p className="text-sm text-muted-foreground">
                Preparing the augmented reality environment...
              </p>
            </>
          )}
          {status === 'requesting' && (
            <>
              <h2 className="text-xl font-semibold text-foreground">Camera Access Required</h2>
              <p className="text-sm text-muted-foreground">
                Please allow camera access to use the AR video player
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h2 className="text-xl font-semibold text-foreground">Something Went Wrong</h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage || 'Unable to access camera. Please check permissions and try again.'}
              </p>
            </>
          )}
        </div>

        {/* Loading Bar */}
        {status === 'loading' && (
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
          </div>
        )}

        {/* Retry Button */}
        {status === 'error' && onRetry && (
          <Button
            variant="glass-primary"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ARLoadingScreen;
