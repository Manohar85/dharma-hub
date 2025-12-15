import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { motion } from 'framer-motion';
import { AIChatbot } from '@/components/ai-assistant/AIChatbot';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const features = [
  {
    icon: '🕉️',
    title: 'Daily Meditation',
    subtitle: '12-min OM resonance',
    link: '/meditation',
    gradient: 'from-primary/30 to-gold/20',
  },
  {
    icon: '🎵',
    title: 'Devotional Music',
    subtitle: 'Sacred mantras & bhajans',
    link: '/music',
    gradient: 'from-gold/30 to-warm/20',
  },
  {
    icon: '🛕',
    title: 'Nearby Temples',
    subtitle: 'Find temples near you',
    link: '/temple-map',
    gradient: 'from-temple/30 to-primary/20',
  },
  {
    icon: '🙏',
    title: 'Dharma AI Chat',
    subtitle: 'Spiritual guidance',
    link: '/ai-helper',
    gradient: 'from-accent/30 to-temple/20',
  },
];

function MainApp() {
  const { preferences } = useUserPreferences();
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-5xl mb-4 block animate-float-slow">🕉️</span>
          <h1 className="text-3xl font-display font-bold text-gradient-divine mb-2">
            Dharma Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Peace • Meditation • Devotion
          </p>
        </motion.div>
      </header>

      {/* Main Features Grid */}
      <main className="flex-1 p-6 pt-4">
        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link
                to={feature.link}
                className={`block bg-gradient-to-br ${feature.gradient} rounded-2xl p-5 border border-border/50 hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Welcome Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center max-w-sm mx-auto"
        >
          <p className="text-muted-foreground text-sm italic">
            "The mind is restless and difficult to restrain, but it is subdued by practice."
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">— Bhagavad Gita 6.35</p>
        </motion.div>
      </main>

      {/* Floating AI Assistant Button */}
      {!showChatbot && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setShowChatbot(true)}
            className="rounded-full w-14 h-14 gradient-divine shadow-gold animate-glow-soft"
            size="lg"
          >
            <Bot className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot
          onClose={() => setShowChatbot(false)}
          minimized={false}
          onMinimize={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
}

function AppContent() {
  const { preferences } = useUserPreferences();

  if (!preferences.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return <MainApp />;
}

export default AppContent;
