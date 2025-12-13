import { createContext, useContext, ReactNode } from 'react';
import { useAudioPlayer, Track } from '@/hooks/useAudioPlayer';

interface AudioPlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
  playTrack: (track: Track) => void;
  pause: () => void;
  play: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  seekPercent: (percent: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={player}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
}
