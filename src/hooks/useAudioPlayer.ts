import { useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  coverUrl?: string;
  fileUrl?: string;
  duration?: number;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  });

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleWaiting = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleError = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: 'Failed to load audio',
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Setup media session for background playback controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update media session metadata when track changes
  useEffect(() => {
    if (currentTrack && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist || 'Unknown Artist',
        artwork: currentTrack.coverUrl
          ? [{ src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
          : [],
      });
    }
  }, [currentTrack]);

  const playTrack = useCallback((track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If same track, just toggle play/pause
    if (currentTrack?.id === track.id) {
      if (state.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      return;
    }

    // New track - use fileUrl or generate a demo URL
    const url = track.fileUrl || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(parseInt(track.id, 16) % 16) + 1}.mp3`;
    
    setState(prev => ({ ...prev, isLoading: true, error: null, currentTime: 0 }));
    setCurrentTrack(track);
    
    audio.src = url;
    audio.load();
    audio.play().catch(err => {
      console.error('Playback error:', err);
      setState(prev => ({ ...prev, isLoading: false, error: 'Playback failed' }));
    });
  }, [currentTrack?.id, state.isPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(console.error);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, pause, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const seekPercent = useCallback((percent: number) => {
    if (audioRef.current && state.duration > 0) {
      const time = (percent / 100) * state.duration;
      seek(time);
    }
  }, [state.duration, seek]);

  return {
    currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    isLoading: state.isLoading,
    error: state.error,
    playTrack,
    pause,
    play,
    togglePlayPause,
    seek,
    seekPercent,
  };
}
