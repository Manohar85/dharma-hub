import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ArrowRight, Compass, BookOpen, Music, Sunrise, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-krishna-arjuna.png";

const quotes = [
  "When Confusion Rises, Dharma Guides.",
  "Act Without Attachment to the Fruits.",
  "The Soul is Eternal, Unborn, Undying.",
  "In Stillness, Discover Your True Self.",
];

const pathways = [
  {
    icon: MessageCircle,
    title: "Ask Krishna",
    subtitle: "Divine Guidance",
    path: "/krishna-guide",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Sunrise,
    title: "Meditate",
    subtitle: "Find Peace",
    path: "/meditation",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    icon: Music,
    title: "Sacred Music",
    subtitle: "Divine Sounds",
    path: "/music",
    gradient: "from-rose-500 to-purple-600",
  },
  {
    icon: Compass,
    title: "Temples",
    subtitle: "Sacred Places",
    path: "/temples",
    gradient: "from-purple-500 to-indigo-600",
  },
];

function ImmersiveHome() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToPathways = () => {
    document.getElementById("pathways")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white overflow-x-hidden">
      {/* ===== SECTION 1: IMMERSIVE HERO (Full Screen) ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Krishna guiding Arjuna on the battlefield of Kurukshetra"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/60 via-transparent to-[#0a0f1a]" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/50 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="relative z-10 text-center px-6 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo/Brand Mark */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-glow-pulse">
                  <Sparkles className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </motion.div>

              {/* Brand Name */}
              <motion.h2
                className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-300/80 mb-6 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Dharma Hub
              </motion.h2>

              {/* Rotating Headlines */}
              <motion.div
                className="h-32 md:h-36 flex items-center justify-center mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentQuote}
                    className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {quotes[currentQuote]}
                  </motion.h1>
                </AnimatePresence>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-base md:text-lg text-amber-200/70 font-light tracking-[0.2em] mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Wisdom • Action • Truth
              </motion.p>

              {/* Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToPathways}
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-10 py-7 text-lg rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:shadow-amber-400/50 hover:scale-105 border border-amber-400/30"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Enter Dharma Hub
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-amber-300/60 hover:text-amber-300 transition-colors cursor-pointer"
          onClick={scrollToPathways}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </section>

      {/* ===== SECTION 2: PATHWAYS ===== */}
      <section
        id="pathways"
        className="relative min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1525] to-[#0a0f1a] py-20 px-6"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Section Header */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amber-50 mb-5">
            Choose Your Path
          </h2>
          <p className="text-amber-200/50 text-lg leading-relaxed">
            Every journey begins with a single step. Where will Dharma guide you today?
          </p>
        </motion.div>

        {/* Pathway Cards Grid */}
        <div className="max-w-xl mx-auto grid grid-cols-2 gap-4 md:gap-5 relative z-10">
          {pathways.map((pathway, index) => (
            <motion.button
              key={pathway.path}
              className="group relative aspect-square rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(pathway.path)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pathway.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Subtle Pattern Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-5 text-white">
                <motion.div
                  className="mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <pathway.icon className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg" />
                </motion.div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-1 drop-shadow-md">
                  {pathway.title}
                </h3>
                <p className="text-sm text-white/80">
                  {pathway.subtitle}
                </p>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Daily Wisdom Card */}
        <motion.div
          className="max-w-xl mx-auto mt-12 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative rounded-2xl overflow-hidden group">
            {/* Animated Gradient Border */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            />
            
            {/* Inner Content */}
            <div className="relative m-[2px] rounded-2xl bg-[#0d1525] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl text-amber-50 mb-3">
                    Daily Wisdom
                  </h3>
                  <p className="text-amber-100/70 text-sm md:text-base leading-relaxed italic">
                    "It is better to perform one's own duty imperfectly than to perform another's duty perfectly. 
                    By doing one's innate duties, a person does not incur sin."
                  </p>
                  <p className="text-amber-400 text-sm mt-4 font-medium">
                    — Bhagavad Gita, Chapter 3, Verse 35
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 3: FOOTER ===== */}
      <section className="relative py-16 px-6 bg-[#0a0f1a]">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-200/40 text-sm mb-6">
              Discover more wisdom through
            </p>
            <div className="flex items-center justify-center gap-8">
              {[
                { path: "/reels", icon: "📱", label: "Reels" },
                { path: "/ai-helper", icon: "🤖", label: "AI Chat" },
                { path: "/profile", icon: "👤", label: "Profile" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 text-amber-400/70 hover:text-amber-300 transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-xs tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Brand Footer */}
          <motion.div
            className="mt-16 pt-8 border-t border-amber-500/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 text-amber-300/50">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs tracking-widest uppercase">
                Dharma Hub
              </span>
            </div>
            <p className="text-amber-200/30 text-xs mt-2">
              Wisdom for the Modern Soul
            </p>
          </motion.div>
        </div>
      </section>
    </div>
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
