import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getWeeklyHoroscope } from '@/lib/ai-service';
import { useEffect, useState } from 'react';

interface HoroscopeWidgetProps {
  zodiacSign: string;
}

export function HoroscopeWidget({ zodiacSign }: HoroscopeWidgetProps) {
  const [horoscope, setHoroscope] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHoroscope() {
      try {
        const weeklyHoroscope = await getWeeklyHoroscope(zodiacSign);
        setHoroscope(weeklyHoroscope);
      } catch (error) {
        setHoroscope("This week brings positive energies and opportunities for spiritual growth. Trust in the divine plan and move forward with faith.");
      } finally {
        setLoading(false);
      }
    }
    loadHoroscope();
  }, [zodiacSign]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-primary/10 to-gold/10 border-accent/20 shadow-soft">
        <div className="absolute top-0 left-0 w-36 h-36 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full gradient-temple flex items-center justify-center shadow-warm"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">This Week's Prediction</h3>
              <p className="text-xs text-muted-foreground">Weekly horoscope</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <motion.p
              className="text-sm text-foreground/85 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {horoscope}
            </motion.p>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>Updated weekly</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
