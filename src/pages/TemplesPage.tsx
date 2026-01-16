import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Clock, Star, Navigation, Search, Filter, Heart, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { getRecommendedTemples, ScoredItem } from '@/lib/ai-recommendations';
import { INDIAN_STATES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function TemplesPage() {
  const { preferences } = useUserPreferences();
  const [temples, setTemples] = useState<ScoredItem<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nearby' | 'popular'>('all');

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

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'popular', label: 'Popular' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-temple/5 pb-24">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-0 w-80 h-80 bg-temple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 pt-12 pb-4"
      >
        <h1 className="text-3xl font-display font-bold">Temple Discovery</h1>
        <p className="text-muted-foreground mt-1">
          {deityInfo?.icon || '🛕'} Sacred places in {stateName}
        </p>
      </motion.header>

      <main className="relative z-10 px-4 space-y-5">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search temples..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-2xl bg-card/60 backdrop-blur-sm border-border/50"
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Filter className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="relative overflow-hidden h-40 bg-gradient-to-br from-temple/20 via-primary/10 to-gold/20 border-0 backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Navigation className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-sm font-medium">Interactive Map</p>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/50" />
            <div className="absolute top-8 right-10 w-1.5 h-1.5 rounded-full bg-gold/50" />
            <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-temple/50" />
          </Card>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'gradient-temple text-primary-foreground shadow-lg'
                  : 'bg-card/60 backdrop-blur-sm hover:bg-card border border-border/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-lg font-display font-bold">Recommended</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        {/* Temple List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50">
                <div className="h-40 bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))
          ) : temples.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-temple/10 flex items-center justify-center mb-6">
                <span className="text-5xl">🛕</span>
              </div>
              <h3 className="text-xl font-display font-bold mb-2">No Temples Found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Temple data for your region will be added soon
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {temples.map((item, index) => (
                <motion.div
                  key={item.item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all group">
                    {/* Temple Image */}
                    <div className="relative h-44 overflow-hidden">
                      {item.item.image ? (
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-temple via-primary/80 to-gold flex items-center justify-center">
                          <span className="text-7xl opacity-80">🛕</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Floating Action */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>

                      {/* Temple Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-display font-bold text-xl drop-shadow-lg">
                          {item.item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Temple Details */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {item.item.followers?.toLocaleString() || 0}
                          </span>
                          {item.item.deity && (
                            <span className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-gold fill-gold" />
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
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.reasons.slice(0, 2).map((reason, i) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                          <Clock className="w-4 h-4 mr-2" />
                          Aarti Times
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl gradient-temple text-primary-foreground">
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
