import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import './MeditationPage.css';

// Meditation phases with durations in seconds
const PHASES = [
  { name: 'Body Relaxation', duration: 60, hasAudio: false, guidance: 'Relax your body... let go of tension...' },
  { name: 'Breath Awareness', duration: 180, hasAudio: false, guidance: 'Focus on your breath... inhale... exhale...' },
  { name: 'OM Resonance', duration: 300, hasAudio: true, guidance: 'Let the sacred OM vibrate within you...' },
  { name: 'Silence', duration: 180, hasAudio: false, guidance: 'Rest in stillness... pure awareness...' },
];

const TOTAL_DURATION = PHASES.reduce((acc, phase) => acc + phase.duration, 0); // 12 minutes

const MeditationPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(PHASES[0].duration);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current phase based on elapsed time
  const calculatePhase = useCallback((totalRemaining: number) => {
    let elapsed = TOTAL_DURATION - totalRemaining;
    let phaseIndex = 0;
    let phaseRemaining = 0;

    for (let i = 0; i < PHASES.length; i++) {
      if (elapsed < PHASES[i].duration) {
        phaseIndex = i;
        phaseRemaining = PHASES[i].duration - elapsed;
        break;
      }
      elapsed -= PHASES[i].duration;
      if (i === PHASES.length - 1) {
        phaseIndex = PHASES.length - 1;
        phaseRemaining = 0;
      }
    }

    return { phaseIndex, phaseRemaining };
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/om.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Fade audio in/out
  const fadeAudio = useCallback((fadeIn: boolean, duration: number = 2000) => {
    if (!audioRef.current) return;

    const targetVolume = fadeIn ? 0.6 : 0;
    const startVolume = audioRef.current.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (fadeIn && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, startVolume + (volumeDiff * currentStep / steps)));
      }
      
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (!fadeIn && audioRef.current) {
          audioRef.current.pause();
        }
      }
    }, stepDuration);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleStop();
            return 0;
          }

          const { phaseIndex, phaseRemaining } = calculatePhase(newTime);
          
          // Check for phase transition
          if (phaseIndex !== currentPhaseIndex) {
            const currentPhase = PHASES[phaseIndex];
            const prevPhase = PHASES[currentPhaseIndex];

            // Handle audio transitions
            if (currentPhase.hasAudio && !prevPhase.hasAudio) {
              fadeAudio(true);
            } else if (!currentPhase.hasAudio && prevPhase.hasAudio) {
              fadeAudio(false);
            }

            setCurrentPhaseIndex(phaseIndex);
          }
          
          setPhaseTimeRemaining(phaseRemaining);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentPhaseIndex, calculatePhase, fadeAudio]);

  const handleStart = () => {
    setIsPlaying(true);
    setTimeRemaining(TOTAL_DURATION);
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(PHASES[0].duration);
    // First phase has no audio, audio starts at OM Resonance phase
  };

  const handleStop = () => {
    setIsPlaying(false);
    fadeAudio(false, 1000);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeRemaining(TOTAL_DURATION);
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(PHASES[0].duration);
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

  const currentPhase = PHASES[currentPhaseIndex];
  const progress = ((TOTAL_DURATION - timeRemaining) / TOTAL_DURATION) * 100;

  return (
    <div className="meditation-screen">
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
          <div className={`om-glow ${isPlaying && currentPhase.hasAudio ? 'active' : ''}`} />
          <span className="om-symbol">ॐ</span>
        </motion.div>

        {/* Phase indicator and timer */}
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="meditation-timer"
            >
              <p className="phase-name">{currentPhase.name}</p>
              <p className="timer-text">{formatTime(timeRemaining)}</p>
              
              {/* Progress bar */}
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guidance text */}
        <motion.p
          key={isPlaying ? currentPhaseIndex : 'idle'}
          className="meditation-guidance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isPlaying ? currentPhase.guidance : 'Close your eyes. Breathe deeply. Begin your journey to inner peace.'}
        </motion.p>

        {/* Controls */}
        <div className="meditation-controls">
          {!isPlaying ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="control-buttons"
            >
              <p className="duration-info">12 minute guided session</p>
              
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
                  variant="outline"
                  size="lg"
                  className="stop-btn"
                >
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
