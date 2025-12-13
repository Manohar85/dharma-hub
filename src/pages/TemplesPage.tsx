import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Clock, Star, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { getRecommendedTemples, ScoredItem } from '@/lib/ai-recommendations';
import { INDIAN_STATES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';
import { PageHeader } from '@/components/navigation/PageHeader';

export default function TemplesPage() {
  const { preferences } = useUserPreferences();
  const [temples, setTemples] = useState<ScoredItem<any>[]>([]);
  const [loading, setLoading] = useState(true);

  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  useEffect(() => {
    async function loadTemples() {
      try {
        const recommended = await getRecommendedTemples(
          preferences.state,
          preferences.deity,
          20
        );
        setTemples(recommended);
      } catch (error) {
        console.error('Error loading temples:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTemples();
  }, [preferences.state, preferences.deity]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader 
        title="Temple Discovery" 
        subtitle={`${deityInfo?.icon || '🛕'} Sacred places in ${stateName}`}
      />

      <main className="p-4 space-y-6">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden h-48 bg-gradient-to-br from-primary/10 to-gold/10 border-primary/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-12 h-12 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                <p className="text-xs text-muted-foreground">Discover temples near you</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Temple List */}
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold">Recommended Temples</h2>
          
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))
          ) : temples.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No temples found for your region</p>
              <p className="text-sm text-muted-foreground mt-2">
                Temple data will be added soon
              </p>
            </Card>
          ) : (
            temples.map((item, index) => (
              <motion.div
                key={item.item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-soft transition-all">
                  {/* Temple Image */}
                  <div className="relative h-48">
                    {item.item.image ? (
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-temple to-gold flex items-center justify-center">
                        <span className="text-6xl">🛕</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-display font-bold text-xl">
                        {item.item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Temple Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {item.item.followers.toLocaleString()} followers
                        </span>
                        {item.item.deity && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold" />
                            {item.item.deity}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.item.description}
                      </p>
                    )}

                    {item.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.reasons.map((reason, i) => (
                          <span
                            key={i}
                            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Clock className="w-4 h-4 mr-2" />
                        Aarti Timings
                      </Button>
                      <Button size="sm" className="flex-1 gradient-saffron">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
