import { motion } from 'framer-motion';
import { Music, Play, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getDailyBhajan } from '@/lib/ai-recommendations';
import { useEffect, useState } from 'react';
import { DEITIES } from '@/lib/constants';

interface DailyBhajanWidgetProps {
  state: string;
  language: string;
  deity: string;
  zodiacSign: string;
}

export function DailyBhajanWidget({ state, language, deity, zodiacSign }: DailyBhajanWidgetProps) {
  const [bhajan, setBhajan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const deityInfo = DEITIES.find(d => d.value === deity);

  useEffect(() => {
    async function loadBhajan() {
      try {
        const dailyBhajan = await getDailyBhajan(state, language, deity, zodiacSign);
        setBhajan(dailyBhajan);
      } catch (error) {
        console.error('Error loading daily bhajan:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBhajan();
  }, [state, language, deity, zodiacSign]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-24 bg-muted rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!bhajan) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-gold/10 via-primary/10 to-accent/10 border-gold/30 shadow-gold">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse-warm" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-gold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Music className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-display font-bold text-foreground">Your Daily Bhajan</h3>
              <p className="text-xs text-muted-foreground">Personalized devotional music</p>
            </div>
            <Sparkles className="w-5 h-5 text-gold" />
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {bhajan.coverUrl ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-warm">
                  <img
                    src={bhajan.coverUrl}
                    alt={bhajan.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-warm">
                  <Music className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{bhajan.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{bhajan.artist || 'Unknown Artist'}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">
                  {bhajan.plays ? `${(bhajan.plays / 1000).toFixed(1)}K plays` : 'New'}
                </span>
                {deityInfo && (
                  <span className="text-lg">{deityInfo.icon}</span>
                )}
              </div>
            </div>
            <motion.button
              className="w-12 h-12 rounded-full gradient-saffron flex items-center justify-center shadow-warm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5 text-white ml-1" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
