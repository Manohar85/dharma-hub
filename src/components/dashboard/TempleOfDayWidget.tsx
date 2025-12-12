import { motion } from 'framer-motion';
import { MapPin, Sparkles, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getTempleOfTheDay } from '@/lib/ai-recommendations';
import { useEffect, useState } from 'react';
import { DEITIES } from '@/lib/constants';

interface TempleOfDayWidgetProps {
  state: string;
  deity: string;
}

export function TempleOfDayWidget({ state, deity }: TempleOfDayWidgetProps) {
  const [temple, setTemple] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const deityInfo = DEITIES.find(d => d.value === deity);

  useEffect(() => {
    async function loadTemple() {
      try {
        const templeOfDay = await getTempleOfTheDay(state, deity);
        setTemple(templeOfDay);
      } catch (error) {
        console.error('Error loading temple of the day:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTemple();
  }, [state, deity]);

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

  if (!temple) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-temple/10 via-accent/10 to-primary/10 border-temple/20 shadow-soft">
        <div className="absolute top-0 left-0 w-36 h-36 bg-temple/5 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full gradient-temple flex items-center justify-center shadow-warm"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Temple of the Day</h3>
              <p className="text-xs text-muted-foreground">Recommended for you</p>
            </div>
            <Sparkles className="w-5 h-5 text-temple ml-auto" />
          </div>

          <div className="space-y-4">
            {temple.image && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-warm">
                <img
                  src={temple.image}
                  alt={temple.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h4 className="font-display font-bold text-xl text-foreground mb-1">{temple.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{temple.location}</span>
              </div>
              {temple.description && (
                <p className="text-sm text-foreground/80 line-clamp-2">{temple.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-4">
                {deityInfo && (
                  <div className="flex items-center gap-1">
                    <span className="text-xl">{deityInfo.icon}</span>
                    <span className="text-xs text-muted-foreground">{deityInfo.label}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {temple.followers ? `${(temple.followers / 1000).toFixed(1)}K followers` : 'Popular'}
                  </span>
                </div>
              </div>
              <motion.button
                className="px-4 py-2 rounded-xl gradient-saffron text-sm font-medium text-white shadow-warm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Visit
              </motion.button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
