import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Track } from '@/hooks/useAudioPlayer';

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  onTogglePlayPause: () => void;
  onSeek: (percent: number) => void;
  onClose?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  isLoading,
  onTogglePlayPause,
  onSeek,
  onClose,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-0 right-0 z-40 px-4"
        >
          <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Progress bar at top */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-gold"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                  {currentTrack.coverUrl ? (
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-gold flex items-center justify-center">
                      <Music className="w-7 h-7 text-primary-foreground" />
                    </div>
                  )}
                  {isPlaying && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate text-foreground">
                    {currentTrack.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentTrack.artist || 'Unknown Artist'}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  {onPrevious && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={onPrevious}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                  )}
                  
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full gradient-divine"
                    onClick={onTogglePlayPause}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </Button>

                  {onNext && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={onNext}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  )}

                  {onClose && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-1"
                      onClick={onClose}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Seekable Progress Bar */}
              <div className="mt-3">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={([value]) => onSeek(value)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
