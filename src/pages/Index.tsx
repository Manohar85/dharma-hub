import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { motion } from 'framer-motion';
import { AIChatbot } from '@/components/ai-assistant/AIChatbot';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DailyMantra {
  id: string;
  sanskrit_text: string;
  transliteration: string | null;
  meaning: string | null;
  deity: string | null;
}

interface Temple {
  id: string;
  name: string;
  state: string;
  deity: string | null;
  description: string | null;
  district: string | null;
}

const navigationCards = [
  {
    icon: '🕉️',
    title: 'Daily Meditation',
    subtitle: '12-min OM resonance',
    link: '/meditation',
  },
  {
    icon: '🎵',
    title: 'Devotional Music',
    subtitle: 'Sacred mantras & bhajans',
    link: '/music',
  },
  {
    icon: '🛕',
    title: 'Nearby Temples',
    subtitle: 'Find temples near you',
    link: '/temple-map',
  },
  {
    icon: '🙏',
    title: 'Dharma AI Chat',
    subtitle: 'Spiritual guidance',
    link: '/ai-helper',
  },
];

const zodiacGuidance = [
  { sign: 'Aries', guidance: 'Channel your fiery energy into meditation today. Mars blesses your spiritual path.' },
  { sign: 'Taurus', guidance: 'Ground yourself in nature. Venus brings harmony to your devotional practice.' },
  { sign: 'Gemini', guidance: 'Seek wisdom through mantras. Mercury enhances your spiritual communication.' },
  { sign: 'Cancer', guidance: 'Honor your ancestors today. The Moon illuminates your inner temple.' },
  { sign: 'Leo', guidance: 'Lead with compassion. The Sun empowers your dharmic service.' },
  { sign: 'Virgo', guidance: 'Practice mindful seva. Mercury guides your path of selfless service.' },
  { sign: 'Libra', guidance: 'Seek balance in all things. Venus harmonizes your spiritual relationships.' },
  { sign: 'Scorpio', guidance: 'Transform through deep meditation. Pluto reveals hidden spiritual truths.' },
  { sign: 'Sagittarius', guidance: 'Expand your spiritual horizons. Jupiter blesses your quest for wisdom.' },
  { sign: 'Capricorn', guidance: 'Build your spiritual discipline. Saturn rewards consistent practice.' },
  { sign: 'Aquarius', guidance: 'Serve humanity today. Uranus inspires innovative dharmic paths.' },
  { sign: 'Pisces', guidance: 'Dissolve into divine love. Neptune deepens your connection to the infinite.' },
];

function MainApp() {
  const { preferences } = useUserPreferences();
  const [showChatbot, setShowChatbot] = useState(false);
  const [dailyMantra, setDailyMantra] = useState<DailyMantra | null>(null);
  const [templeOfDay, setTempleOfDay] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch daily mantra based on day of week
        const dayOfWeek = new Date().getDay();
        const { data: mantras } = await supabase
          .from('daily_mantras')
          .select('*')
          .eq('day_of_week', dayOfWeek)
          .limit(1);
        
        if (mantras && mantras.length > 0) {
          setDailyMantra(mantras[0]);
        } else {
          // Fallback to any mantra
          const { data: fallbackMantras } = await supabase
            .from('daily_mantras')
            .select('*')
            .limit(1);
          if (fallbackMantras && fallbackMantras.length > 0) {
            setDailyMantra(fallbackMantras[0]);
          }
        }

        // Fetch temple of the day (random based on date)
        const { data: temples } = await supabase
          .from('temples')
          .select('*');
        
        if (temples && temples.length > 0) {
          const dayIndex = new Date().getDate() % temples.length;
          setTempleOfDay(temples[dayIndex]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get zodiac guidance based on user preference or random
  const userZodiac = preferences.zodiacSign || 'Leo';
  const zodiacInfo = zodiacGuidance.find(z => z.sign.toLowerCase() === userZodiac.toLowerCase()) || zodiacGuidance[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex flex-col">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400), 
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800 
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Hero Header with Pulsing Aura */}
      <header className="relative p-8 pt-12 text-center">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.span 
            className="text-6xl mb-4 block"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🕉️
          </motion.span>
          <h1 className="text-4xl font-display font-bold text-gradient-divine mb-3">
            Dharma Hub
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Meditation • Music • Temples
          </p>
        </motion.div>
      </header>

      <main className="flex-1 p-6 pt-2 max-w-lg mx-auto w-full space-y-6">
        {/* Daily Mantra Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-warm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="font-display font-semibold text-lg text-foreground">Daily Mantra</h2>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-muted/50 rounded w-3/4" />
              <div className="h-4 bg-muted/30 rounded w-1/2" />
              <div className="h-4 bg-muted/30 rounded w-full" />
            </div>
          ) : dailyMantra ? (
            <div className="space-y-3">
              <p className="text-2xl font-display text-gold leading-relaxed">
                {dailyMantra.sanskrit_text}
              </p>
              {dailyMantra.transliteration && (
                <p className="text-sm text-muted-foreground italic">
                  {dailyMantra.transliteration}
                </p>
              )}
              {dailyMantra.meaning && (
                <p className="text-sm text-foreground/80">
                  {dailyMantra.meaning}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              "ॐ शांति शांति शांति" — Om Peace Peace Peace
            </p>
          )}
        </motion.section>

        {/* Temple of the Day Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-warm"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🛕</span>
            <h2 className="font-display font-semibold text-lg text-foreground">Temple of the Day</h2>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-muted/50 rounded w-2/3" />
              <div className="h-4 bg-muted/30 rounded w-1/3" />
              <div className="h-4 bg-muted/30 rounded w-full" />
            </div>
          ) : templeOfDay ? (
            <div className="space-y-2">
              <h3 className="text-xl font-display text-temple">
                {templeOfDay.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {templeOfDay.district && `${templeOfDay.district}, `}
                {templeOfDay.state?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              {templeOfDay.description && (
                <p className="text-sm text-foreground/80 mt-2">
                  {templeOfDay.description}
                </p>
              )}
              <Link 
                to="/temple-map" 
                className="inline-block mt-3 text-sm text-gold hover:text-gold/80 transition-colors"
              >
                Explore more temples →
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Visit your local temple for blessings today.
            </p>
          )}
        </motion.section>

        {/* Zodiac Guidance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl p-6 border border-border/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✨</span>
            <h2 className="font-display font-semibold text-lg text-foreground">
              Today's Guidance — {zodiacInfo.sign}
            </h2>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {zodiacInfo.guidance}
          </p>
        </motion.section>

        {/* Navigation Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="font-display font-semibold text-lg text-foreground px-1">
            Explore
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {navigationCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={card.link}
                  className="flex items-center gap-4 bg-card/30 hover:bg-card/50 rounded-xl p-4 border border-border/20 hover:border-gold/30 transition-all duration-300 hover:shadow-gold group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center py-6"
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
          transition={{ delay: 1.2 }}
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
