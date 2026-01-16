import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ArrowRight, Compass, Music, MessageCircle, Play, Headphones, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Minimal symbolic icon component for Krishna-Arjuna
const DharmaSymbol = () => (
  <motion.svg
    viewBox="0 0 120 120"
    className="w-32 h-32 md:w-40 md:h-40"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
  >
    {/* Outer glow ring */}
    <motion.circle
      cx="60"
      cy="60"
      r="55"
      fill="none"
      stroke="url(#glowGradient)"
      strokeWidth="1"
      opacity="0.4"
      animate={{ 
        r: [55, 57, 55],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Main circle */}
    <motion.circle
      cx="60"
      cy="60"
      r="48"
      fill="none"
      stroke="url(#mainGradient)"
      strokeWidth="1.5"
      opacity="0.6"
    />
    
    {/* Chariot wheel - Symbol of Dharma */}
    <motion.circle
      cx="60"
      cy="60"
      r="35"
      fill="none"
      stroke="url(#wheelGradient)"
      strokeWidth="2"
      strokeDasharray="8 4"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "60px 60px" }}
    />
    
    {/* Inner sacred geometry - 8 spokes */}
    {[...Array(8)].map((_, i) => (
      <motion.line
        key={i}
        x1="60"
        y1="60"
        x2={60 + 28 * Math.cos((i * Math.PI) / 4)}
        y2={60 + 28 * Math.sin((i * Math.PI) / 4)}
        stroke="hsl(42 85% 55%)"
        strokeWidth="1"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
      />
    ))}
    
    {/* Center lotus / Om symbol representation */}
    <motion.circle
      cx="60"
      cy="60"
      r="12"
      fill="url(#centerGradient)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
    />
    
    {/* Two figures abstraction - Krishna (guide) and Arjuna (seeker) */}
    <motion.path
      d="M50 55 Q55 45 60 55 Q65 45 70 55"
      fill="none"
      stroke="hsl(42 85% 65%)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 1.2 }}
    />
    
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(42 85% 55%)" />
        <stop offset="100%" stopColor="hsl(25 95% 53%)" />
      </linearGradient>
      <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(42 85% 60%)" />
        <stop offset="100%" stopColor="hsl(25 90% 55%)" />
      </linearGradient>
      <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(25 90% 55%)" />
        <stop offset="100%" stopColor="hsl(42 85% 55%)" />
      </linearGradient>
      <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(42 90% 60%)" />
        <stop offset="100%" stopColor="hsl(25 95% 50%)" />
      </radialGradient>
    </defs>
  </motion.svg>
);

const pathways = [
  {
    icon: MessageCircle,
    title: "Ask Krishna",
    subtitle: "AI Wisdom",
    path: "/krishna-guide",
    description: "Get divine guidance for life's questions",
  },
  {
    icon: Play,
    title: "Wisdom Reels",
    subtitle: "Short Videos",
    path: "/reels",
    description: "Quick spiritual insights in seconds",
  },
  {
    icon: Headphones,
    title: "Sacred Music",
    subtitle: "Bhajans & Mantras",
    path: "/music",
    description: "Curated devotional audio",
  },
  {
    icon: MapPin,
    title: "Temples",
    subtitle: "Sacred Places",
    path: "/temples",
    description: "Discover holy destinations",
  },
];

function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#0c0f18] via-[#101420] to-[#0c0f18] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(25 90% 50% / 0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles - very subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isReady && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Symbolic Icon */}
            <motion.div className="mb-10">
              <DharmaSymbol />
            </motion.div>

            {/* Brand Name - subtle */}
            <motion.p
              className="text-amber-400/60 text-xs tracking-[0.4em] uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Dharma Hub
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-amber-50 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              When Confusion Rises,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                Dharma Guides.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-amber-200/50 text-sm tracking-[0.25em] uppercase mb-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Wisdom · Action · Truth
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Button
                size="lg"
                onClick={onEnter}
                className="group relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium px-10 py-7 text-base rounded-full shadow-2xl shadow-amber-500/25 transition-all duration-500 hover:shadow-amber-400/40 hover:scale-105 border border-amber-400/20"
              >
                <span className="flex items-center gap-3">
                  Enter Dharma Hub
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>

            {/* Subtle hint */}
            <motion.p
              className="text-amber-200/30 text-xs mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Your journey to wisdom begins here
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#0c0f18] via-[#101420] to-[#0c0f18] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c0f18]/80 backdrop-blur-xl border-b border-amber-500/10">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg text-amber-50">Dharma Hub</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {/* Welcome Section */}
        <section className="px-6 pt-8 pb-6 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-amber-200/50 text-sm mb-1">Namaste 🙏</p>
            <h2 className="font-display text-2xl md:text-3xl text-amber-50 font-medium">
              Choose Your Path
            </h2>
          </motion.div>
        </section>

        {/* Pathway Cards */}
        <section className="px-6 max-w-lg mx-auto">
          <div className="space-y-3">
            {pathways.map((pathway, index) => (
              <motion.button
                key={pathway.path}
                onClick={() => navigate(pathway.path)}
                className="w-full group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/15 hover:border-amber-400/30 transition-all duration-300 group-hover:bg-amber-500/15">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-colors">
                    <pathway.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-display text-lg text-amber-50 mb-0.5 group-hover:text-amber-100 transition-colors">
                      {pathway.title}
                    </h3>
                    <p className="text-amber-200/50 text-sm">
                      {pathway.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Daily Wisdom */}
        <section className="px-6 mt-8 max-w-lg mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-orange-400/30 to-amber-500/30 rounded-2xl" />
            
            {/* Content */}
            <div className="relative m-[1px] rounded-2xl bg-[#0d1118] p-6">
              <p className="text-amber-400/60 text-xs tracking-widest uppercase mb-3">
                Daily Wisdom
              </p>
              <p className="text-amber-100/80 text-sm md:text-base leading-relaxed font-light italic">
                "It is better to perform one's own duty imperfectly than to perform another's duty perfectly."
              </p>
              <p className="text-amber-400/70 text-xs mt-4">
                — Bhagavad Gita 3.35
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0f18]/95 backdrop-blur-xl border-t border-amber-500/10">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-around">
          {[
            { icon: Compass, label: "Home", path: "/", active: true },
            { icon: Play, label: "Reels", path: "/reels", active: false },
            { icon: Headphones, label: "Music", path: "/music", active: false },
            { icon: MessageCircle, label: "Krishna", path: "/krishna-guide", active: false },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                item.active 
                  ? "text-amber-400" 
                  : "text-amber-200/40 hover:text-amber-200/70"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}

function ImmersiveHome() {
  const [showIntro, setShowIntro] = useState(true);

  const handleEnter = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onEnter={handleEnter} />
        ) : (
          <HomeScreen key="home" />
        )}
      </AnimatePresence>
    </>
  );
}

function AppContent() {
  const { preferences } = useUserPreferences();

  if (!preferences.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return <ImmersiveHome />;
}

export default AppContent;
