import { useUserPreferences, UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Home, Music, Video, MapPin, Users, User } from 'lucide-react';
import { INDIAN_STATES, LANGUAGES, DEITIES } from '@/lib/constants';

function MainApp() {
  const { preferences } = useUserPreferences();
  
  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const langName = LANGUAGES.find(l => l.value === preferences.language)?.label || 'Hindi';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-warm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-display font-bold text-gradient-divine">Bhakti</h1>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{deityInfo?.icon || '🕉️'}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-6">
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
          <h2 className="text-xl font-display font-semibold mb-4">Welcome, Devotee! 🙏</h2>
          <p className="text-muted-foreground mb-4">Your personalized feed from <strong>{stateName}</strong> is ready.</p>
          
          <div className="grid grid-cols-3 gap-3">
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Music, label: 'Regional Music', desc: 'Devotional songs', color: 'bg-primary' },
            { icon: Video, label: 'Reels', desc: 'Watch & create', color: 'bg-accent' },
            { icon: MapPin, label: 'Temples', desc: 'Nearby temples', color: 'bg-gold' },
            { icon: Users, label: 'Community', desc: 'Join groups', color: 'bg-temple' },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-warm transition-shadow cursor-pointer">
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">{item.label}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
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
