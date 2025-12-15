import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import './MeditationPage.css';

const MeditationPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(12); // 12 minutes default
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/audio/om.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const handleStart = () => {
    setIsPlaying(true);
    setTimeRemaining(duration * 60);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    handleStop();
    navigate(-1);
  };

  return (
    <div className="meditation-screen">
      {/* Background gradient overlay */}
      <div className="meditation-bg-overlay" />

      {/* Exit button */}
      <Button
        variant="ghost"
        size="icon"
        className="meditation-exit-btn"
        onClick={handleExit}
      >
        <X className="w-6 h-6 text-foreground/70" />
      </Button>

      {/* Main content */}
      <div className="meditation-content">
        {/* OM Symbol with breathing animation */}
        <motion.div
          className={`om-container ${isPlaying ? 'breathing' : ''}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className={`om-glow ${isPlaying ? 'active' : ''}`} />
          <span className="om-symbol">ॐ</span>
        </motion.div>

        {/* Timer display */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="meditation-timer"
            >
              <p className="timer-text">{formatTime(timeRemaining)}</p>
              <p className="timer-label">remaining</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guidance text */}
        <motion.p
          className="meditation-guidance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isPlaying
            ? "Let the sound OM resonate softly within… allow the vibration to settle the mind…"
            : "Close your eyes. Breathe deeply. Let the sacred OM guide you to inner peace."}
        </motion.p>

        {/* Controls */}
        <div className="meditation-controls">
          {!isPlaying ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="control-buttons"
            >
              {/* Duration selector */}
              <div className="duration-selector">
                {[5, 12, 20].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`duration-btn ${duration === mins ? 'active' : ''}`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>

              <Button
                onClick={handleStart}
                className="start-btn gradient-divine"
                size="lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Begin Meditation
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="control-buttons"
            >
              <div className="playing-controls">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="mute-btn"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  onClick={handleStop}
                  variant="destructive"
                  size="lg"
                  className="stop-btn"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  End Session
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
