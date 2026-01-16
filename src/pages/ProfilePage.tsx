import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Heart, Music, Video, MapPin, LogOut, Edit2, Bell, Moon, 
  Globe, ChevronRight, Sparkles, BookOpen, Compass
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { INDIAN_STATES, LANGUAGES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';
import { AddContentModal } from '@/components/profile/AddContentModal';

export default function ProfilePage() {
  const [showAddMusic, setShowAddMusic] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const { preferences, resetPreferences } = useUserPreferences();

  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const langName = LANGUAGES.find(l => l.value === preferences.language)?.label || 'Hindi';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  const handleResetPreferences = () => {
    if (confirm('This will reset all your preferences. Are you sure?')) {
      resetPreferences();
    }
  };

  const journeyItems = [
    { icon: BookOpen, label: 'Wisdom Gained', value: '12', color: 'text-primary' },
    { icon: Music, label: 'Bhajans Played', value: '48', color: 'text-gold' },
    { icon: Compass, label: 'Temples Visited', value: '3', color: 'text-temple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-24">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-primary/30 via-gold/20 to-temple/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_100%)]" />
          <motion.div
            className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gold/20 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        {/* Avatar & Info */}
        <div className="px-6 -mt-16 relative z-10">
          <div className="flex items-end gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-gold flex items-center justify-center border-4 border-background shadow-lg">
                <span className="text-5xl">{deityInfo?.icon || '🙏'}</span>
              </div>
              <Button 
                size="icon" 
                variant="secondary"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-md"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pb-2"
            >
              <h1 className="text-2xl font-display font-bold">{preferences.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {stateName} • {langName.split(' ')[0]}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="relative z-10 px-4 pt-6 space-y-5">
        {/* Spiritual Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-5 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-display font-bold">Your Spiritual Journey</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {journeyItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="text-center p-3 rounded-2xl bg-muted/50"
                >
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Preferences Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold">Your Dharma Profile</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                Edit <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">{stateName}</p>
                <p className="text-xs text-muted-foreground">Region</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20">
                <Globe className="w-5 h-5 text-gold mb-2" />
                <p className="font-medium text-sm">{langName.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">Language</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-temple/10 to-temple/5 border border-temple/20">
                <span className="text-2xl block mb-1">{deityInfo?.icon}</span>
                <p className="font-medium text-sm">{deityInfo?.label}</p>
                <p className="text-xs text-muted-foreground">Ishta Devata</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <span className="text-2xl block mb-1">♌</span>
                <p className="font-medium text-sm">{preferences.zodiacSign}</p>
                <p className="text-xs text-muted-foreground">Rashi</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            onClick={() => setShowAddMusic(true)}
            className="h-14 rounded-2xl gradient-saffron shadow-warm"
          >
            <Music className="w-5 h-5 mr-2" />
            Add Music
          </Button>
          <Button
            onClick={() => setShowAddPost(true)}
            variant="outline"
            className="h-14 rounded-2xl border-primary/30 hover:bg-primary/10"
          >
            <Video className="w-5 h-5 mr-2" />
            Share Reel
          </Button>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50">
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-xs text-muted-foreground">Morning mantras & evening aarti</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Easier on the eyes</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">App Settings</p>
                  <p className="text-xs text-muted-foreground">Privacy, notifications & more</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Start Fresh</p>
                  <p className="text-xs text-muted-foreground">Reset all preferences</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleResetPreferences}
              >
                Reset
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

      <BottomNav />

      {/* Modals */}
      <AddContentModal
        type="music"
        isOpen={showAddMusic}
        onClose={() => setShowAddMusic(false)}
      />
      <AddContentModal
        type="post"
        isOpen={showAddPost}
        onClose={() => setShowAddPost(false)}
      />
    </div>
  );
}
