import { useUserPreferences, UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Home, Music, Video, MapPin, Users, User } from 'lucide-react';
import { INDIAN_STATES, LANGUAGES, DEITIES } from '@/lib/constants';
import { YourDayWidget } from '@/components/dashboard/YourDayWidget';
import { ZodiacWidget } from '@/components/dashboard/ZodiacWidget';
import { HoroscopeWidget } from '@/components/dashboard/HoroscopeWidget';
import { DivineMessageWidget } from '@/components/dashboard/DivineMessageWidget';
import { RegionalTrendingWidget } from '@/components/dashboard/RegionalTrendingWidget';
import { AIRecommendedReelsWidget } from '@/components/dashboard/AIRecommendedReelsWidget';
import { DailyBhajanWidget } from '@/components/dashboard/DailyBhajanWidget';
import { TempleOfDayWidget } from '@/components/dashboard/TempleOfDayWidget';
import { PanchangamWidget } from '@/components/dashboard/PanchangamWidget';
import { AIChatbot } from '@/components/ai-assistant/AIChatbot';
import { useBackgroundRefresh } from '@/hooks/useBackgroundRefresh';
import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function MainApp() {
  const { preferences } = useUserPreferences();
  const [showChatbot, setShowChatbot] = useState(false);
  
  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const langName = LANGUAGES.find(l => l.value === preferences.language)?.label || 'Hindi';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  // Enable background refresh
  useBackgroundRefresh({
    deity: preferences.deity,
    zodiacSign: preferences.zodiacSign,
    state: preferences.state,
    language: preferences.language,
    enabled: true
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-warm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gradient-divine">Bhakti</h1>
            <p className="text-xs text-muted-foreground">Welcome back, {preferences.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-float">{deityInfo?.icon || '🕉️'}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-6">
        {/* Personalized Dashboard Widgets */}
        <div className="space-y-4">
          <YourDayWidget 
            deity={preferences.deity} 
            name={preferences.name}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ZodiacWidget zodiacSign={preferences.zodiacSign} />
            <HoroscopeWidget zodiacSign={preferences.zodiacSign} />
          </div>

          <DivineMessageWidget deity={preferences.deity} />
          
          {/* AI-Powered Recommendations */}
          <DailyBhajanWidget
            state={preferences.state}
            language={preferences.language}
            deity={preferences.deity}
            zodiacSign={preferences.zodiacSign}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TempleOfDayWidget
              state={preferences.state}
              deity={preferences.deity}
            />
            <PanchangamWidget />
          </div>

          <AIRecommendedReelsWidget
            state={preferences.state}
            language={preferences.language}
            deity={preferences.deity}
          />
          
          <RegionalTrendingWidget 
            state={preferences.state}
            language={preferences.language}
            deity={preferences.deity}
          />
        </div>

        {/* User Preferences Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
          <h2 className="text-lg font-display font-semibold mb-4">Your Preferences</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <MapPin className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-xs font-medium">{stateName}</p>
            </div>
            <div className="bg-gold/10 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">🗣️</span>
              <p className="text-xs font-medium">{langName.split(' ')[0]}</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">{deityInfo?.icon}</span>
              <p className="text-xs font-medium">{deityInfo?.label}</p>
            </div>
            <div className="bg-warm/10 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">♌</span>
              <p className="text-xs font-medium">Your Zodiac</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Music, label: 'Regional Music', desc: 'Devotional songs', color: 'bg-primary', link: '#' },
            { icon: Video, label: 'Reels', desc: 'Watch & create', color: 'bg-accent', link: '#' },
            { icon: MapPin, label: 'Temples', desc: 'Nearby temples', color: 'bg-gold', link: '#' },
            { icon: Users, label: 'Community', desc: 'Join groups', color: 'bg-temple', link: '#' },
            { icon: Bot, label: 'Ask Divine', desc: 'AI Assistant', color: 'bg-gradient-to-br from-primary to-gold', link: '/ai-helper' },
          ].map((item) => (
            item.link === '#' ? (
              <div key={item.label} className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-warm transition-all cursor-pointer hover:scale-[1.02]">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ) : (
              <Link key={item.label} to={item.link} className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-warm transition-all cursor-pointer hover:scale-[1.02]">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Link>
            )
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border glass-warm">
        <div className="flex justify-around py-3">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: Music, label: 'Music' },
            { icon: Video, label: 'Reels' },
            { icon: MapPin, label: 'Temples' },
            { icon: User, label: 'Profile' },
          ].map((item) => (
            <button key={item.label} className={`flex flex-col items-center gap-1 px-3 ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Floating AI Assistant Button */}
      {!showChatbot && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-24 right-4 z-50"
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

const Index = () => (
  <UserPreferencesProvider>
    <AppContent />
  </UserPreferencesProvider>
);

export default Index;