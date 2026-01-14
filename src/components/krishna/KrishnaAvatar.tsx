import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import krishnaAvatar from "@/assets/krishna-avatar-adult.png";

interface KrishnaAvatarProps {
  message?: string;
  autoSpeak?: boolean;
  className?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

const KrishnaAvatar: React.FC<KrishnaAvatarProps> = ({
  message,
  autoSpeak = false,
  className = "",
  onSpeakingChange,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message || "");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      if (autoSpeak && !isMuted) {
        speakMessage(message);
      }
    }
  }, [message, autoSpeak, isMuted]);

  const speakMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/krishna-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        onSpeakingChange?.(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      await audio.play();
    } catch (error) {
      console.error("Failed to speak:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    } else if (currentMessage) {
      speakMessage(currentMessage);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Divine Aura */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
          opacity: isSpeaking ? [0.6, 0.8, 0.6] : 0.4,
        }}
        transition={{
          duration: 2,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/30 via-orange-300/20 to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Krishna Avatar Image */}
      <motion.div
        className="relative w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
        animate={{
          y: isSpeaking ? [0, -5, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <img
          src={krishnaAvatar}
          alt="Lord Krishna - Divine Guide"
          className="w-full h-full object-cover object-top"
        />

        {/* Speaking Indicator Overlay */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0] }}
              exit={{ scaleX: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          disabled={isLoading || !currentMessage}
          className="rounded-full bg-background/80 backdrop-blur-sm border-amber-500/30 hover:bg-amber-500/20"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
          ) : isSpeaking ? (
            <Pause className="h-4 w-4 text-amber-600" />
          ) : (
            <Play className="h-4 w-4 text-amber-600" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="rounded-full bg-background/80 backdrop-blur-sm border-amber-500/30 hover:bg-amber-500/20"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-amber-600" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-600" />
          )}
        </Button>
      </div>

      {/* Message Display */}
      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.div
            key={currentMessage}
            className="mt-4 max-w-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed">
              "{currentMessage}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KrishnaAvatar;
