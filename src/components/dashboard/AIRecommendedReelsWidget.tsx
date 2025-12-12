import { motion } from 'framer-motion';
import { Video, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getRecommendedReels, ScoredItem } from '@/lib/ai-recommendations';
import { useEffect, useState } from 'react';

interface AIRecommendedReelsWidgetProps {
  state: string;
  language: string;
  deity: string;
}

export function AIRecommendedReelsWidget({ state, language, deity }: AIRecommendedReelsWidgetProps) {
  const [reels, setReels] = useState<ScoredItem<any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReels() {
      try {
        const recommended = await getRecommendedReels(state, language, deity, 3);
        setReels(recommended);
      } catch (error) {
        console.error('Error loading recommended reels:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReels();
  }, [state, language, deity]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-primary/10 to-warm/10 border-primary/20 shadow-soft">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-warm"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">AI Recommended Reels</h3>
              <p className="text-xs text-muted-foreground">Personalized for you</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {reels.slice(0, 3).map((reelItem, index) => (
              <motion.div
                key={reelItem.item.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-[9/16] rounded-xl overflow-hidden bg-muted relative">
                  {reelItem.item.thumbnail ? (
                    <img
                      src={reelItem.item.thumbnail}
                      alt={reelItem.item.caption || 'Reel'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white line-clamp-2 font-medium">
                      {reelItem.item.caption || 'Devotional Reel'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Video className="w-3 h-3 text-white/80" />
                      <span className="text-xs text-white/80">
                        {(reelItem.item.views / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                  {reelItem.reasons.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-primary/90 rounded-full p-1">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {reels.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No recommendations available at the moment
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
