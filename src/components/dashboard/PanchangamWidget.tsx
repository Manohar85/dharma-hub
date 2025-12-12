import { motion } from 'framer-motion';
import { Calendar, Sunrise, Sunset, Moon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getTodayPanchangam, Panchangam } from '@/lib/panchangam';
import { useEffect, useState } from 'react';

export function PanchangamWidget() {
  const [panchangam, setPanchangam] = useState<Panchangam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPanchangam() {
      try {
        const today = await getTodayPanchangam();
        setPanchangam(today);
      } catch (error) {
        console.error('Error loading panchangam:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPanchangam();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-32 bg-muted rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!panchangam) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-warm/10 via-gold/10 to-primary/10 border-gold/20 shadow-warm">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-gold"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Today's Panchangam</h3>
              <p className="text-xs text-muted-foreground">Hindu calendar</p>
            </div>
            <Sparkles className="w-5 h-5 text-gold ml-auto" />
          </div>

          <div className="space-y-4">
            {/* Main Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/50 rounded-xl p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Tithi</p>
                <p className="text-sm font-semibold text-foreground">{panchangam.tithi}</p>
              </div>
              <div className="bg-card/50 rounded-xl p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Nakshatra</p>
                <p className="text-sm font-semibold text-foreground">{panchangam.nakshatra}</p>
              </div>
              <div className="bg-card/50 rounded-xl p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Yoga</p>
                <p className="text-sm font-semibold text-foreground">{panchangam.yoga}</p>
              </div>
              <div className="bg-card/50 rounded-xl p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Karana</p>
                <p className="text-sm font-semibold text-foreground">{panchangam.karana}</p>
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-warm" />
                  <span className="text-muted-foreground">Sunrise</span>
                </div>
                <span className="font-medium text-foreground">{panchangam.sunrise}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4 text-gold" />
                  <span className="text-muted-foreground">Sunset</span>
                </div>
                <span className="font-medium text-foreground">{panchangam.sunset}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Moon Rise</span>
                </div>
                <span className="font-medium text-foreground">{panchangam.moonRise}</span>
              </div>
            </div>

            {/* Auspicious Timings */}
            <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-2">Auspicious Times</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Abhijit Muhurta</span>
                  <span className="text-foreground font-medium">{panchangam.auspiciousTimings.abhijit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amrit Kala</span>
                  <span className="text-foreground font-medium">{panchangam.auspiciousTimings.amrit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
