import { motion } from 'framer-motion';
import { User, Settings, Heart, Music, Video, MapPin, LogOut, Edit2, Bell, Moon, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { INDIAN_STATES, LANGUAGES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';
import { PageHeader } from '@/components/navigation/PageHeader';

export default function ProfilePage() {
  const { preferences, resetPreferences } = useUserPreferences();

  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const langName = LANGUAGES.find(l => l.value === preferences.language)?.label || 'Hindi';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  const handleResetPreferences = () => {
    if (confirm('This will reset all your preferences. Are you sure?')) {
      resetPreferences();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profile" subtitle="Manage your spiritual journey" />

      <main className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/30 via-gold/20 to-accent/30" />
            <div className="px-6 pb-6">
              <div className="relative -mt-12 flex items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center border-4 border-background shadow-lg">
                  <span className="text-4xl">{deityInfo?.icon || '🙏'}</span>
                </div>
                <div className="flex-1 pb-1">
                  <h2 className="text-2xl font-display font-bold">{preferences.name}</h2>
                  <p className="text-muted-foreground">{stateName} • {langName}</p>
                </div>
                <Button variant="outline" size="icon">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Preferences Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold mb-4">Your Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-xl p-4">
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-medium">{stateName}</p>
                <p className="text-xs text-muted-foreground">Region</p>
              </div>
              <div className="bg-gold/10 rounded-xl p-4">
                <Globe className="w-5 h-5 text-gold mb-2" />
                <p className="text-sm font-medium">{langName.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">Language</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4">
                <span className="text-2xl block mb-1">{deityInfo?.icon}</span>
                <p className="text-sm font-medium">{deityInfo?.label}</p>
                <p className="text-xs text-muted-foreground">Ishta Devata</p>
              </div>
              <div className="bg-warm/10 rounded-xl p-4">
                <span className="text-2xl block mb-1">♌</span>
                <p className="text-sm font-medium">{preferences.zodiacSign}</p>
                <p className="text-xs text-muted-foreground">Zodiac Sign</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold mb-4">Your Activity</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Liked</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-2">
                  <Music className="w-6 h-6 text-gold" />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Played</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-2">
                  <Video className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Viewed</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Daily reminders & updates</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
              <Switch disabled />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">App Settings</p>
                  <p className="text-xs text-muted-foreground">Manage app behavior</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 border-destructive/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Reset Preferences</p>
                  <p className="text-xs text-muted-foreground">Start fresh with onboarding</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={handleResetPreferences}
              >
                Reset
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
