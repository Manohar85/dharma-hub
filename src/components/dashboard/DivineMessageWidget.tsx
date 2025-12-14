import { motion } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDailyBhagavadGitaSloka } from '@/lib/ai-service';
import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface BhagavadGitaSloka {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
}

export function DivineMessageWidget() {
  const { preferences } = useUserPreferences();
  const [sloka, setSloka] = useState<BhagavadGitaSloka | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSanskrit, setShowSanskrit] = useState(true);

  useEffect(() => {
    loadSloka();
  }, [preferences.language]);

  async function loadSloka() {
    setLoading(true);
    try {
      const dailySloka = await getDailyBhagavadGitaSloka(preferences.language);
      setSloka(dailySloka);
    } catch (error) {
      console.error('Error loading sloka:', error);
      // Fallback sloka
      setSloka({
        chapter: 2,
        verse: 47,
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
        transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana",
        translation: "You have the right to work, but never to the fruit of work.",
        meaning: "Focus on your duties without attachment to results."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-temple/10 via-accent/10 to-primary/10 border-temple/20 shadow-gold">
        <div className="absolute top-0 right-0 w-40 h-40 bg-temple/5 rounded-full blur-3xl animate-pulse-warm" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-warm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">Daily Bhagavad Gita</h3>
                <p className="text-xs text-muted-foreground">
                  {sloka ? `Chapter ${sloka.chapter}, Verse ${sloka.verse}` : 'Loading...'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSanskrit(!showSanskrit)}
              className="h-8 w-8"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ) : sloka && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Sanskrit Text */}
              {showSanskrit && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="text-lg font-medium text-foreground leading-relaxed text-center font-serif">
                    {sloka.sanskrit}
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-2 italic">
                    {sloka.transliteration}
                  </p>
                </div>
              )}

              {/* Translation */}
              <div className="space-y-2">
                <p className="text-base text-foreground/90 leading-relaxed font-medium">
                  "{sloka.translation}"
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sloka.meaning}
                </p>
              </div>
            </motion.div>
          )}

          {/* Decorative Om */}
          <div className="mt-6 flex items-center justify-center">
            <span className="text-4xl animate-float">🕉️</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
