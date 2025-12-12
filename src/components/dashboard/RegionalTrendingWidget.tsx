import { motion } from 'framer-motion';
import { TrendingUp, Music, Image as ImageIcon, Video, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getRegionalTrending, TrendingContent } from '@/lib/content-api';
import { useEffect, useState } from 'react';
import { INDIAN_STATES } from '@/lib/constants';

interface RegionalTrendingWidgetProps {
  state: string;
  language: string;
  deity: string;
}

export function RegionalTrendingWidget({ state, language, deity }: RegionalTrendingWidgetProps) {
  const [content, setContent] = useState<TrendingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const stateName = INDIAN_STATES.find(s => s.value === state)?.label || 'Your Region';

  useEffect(() => {
    async function loadTrending() {
      try {
        const trending = await getRegionalTrending(state, language, deity);
        setContent(trending);
      } catch (error) {
        console.error('Error loading trending content:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, [state, language, deity]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-warm/10 via-primary/10 to-gold/10 border-primary/20 shadow-soft">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="w-12 h-12 rounded-full gradient-saffron flex items-center justify-center shadow-warm"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Trending in {stateName}</h3>
              <p className="text-xs text-muted-foreground">Popular content</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {content.music.length > 0 && (
              <motion.div
                className="bg-card/50 rounded-xl p-3 border border-border/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold">Music</span>
                </div>
                <p className="text-xs text-foreground/80 truncate">{content.music[0]?.title || 'N/A'}</p>
                <p className="text-xs text-muted-foreground mt-1">{content.music[0]?.plays.toLocaleString() || 0} plays</p>
              </motion.div>
            )}

            {content.posts.length > 0 && (
              <motion.div
                className="bg-card/50 rounded-xl p-3 border border-border/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Posts</span>
                </div>
                <p className="text-xs text-foreground/80 line-clamp-2">{content.posts[0]?.caption || 'N/A'}</p>
                <p className="text-xs text-muted-foreground mt-1">{content.posts[0]?.likes.toLocaleString() || 0} likes</p>
              </motion.div>
            )}

            {content.reels.length > 0 && (
              <motion.div
                className="bg-card/50 rounded-xl p-3 border border-border/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-warm" />
                  <span className="text-xs font-semibold">Reels</span>
                </div>
                <p className="text-xs text-foreground/80 truncate">{content.reels[0]?.caption || 'N/A'}</p>
                <p className="text-xs text-muted-foreground mt-1">{content.reels[0]?.views.toLocaleString() || 0} views</p>
              </motion.div>
            )}

            {content.temples.length > 0 && (
              <motion.div
                className="bg-card/50 rounded-xl p-3 border border-border/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-temple" />
                  <span className="text-xs font-semibold">Temples</span>
                </div>
                <p className="text-xs text-foreground/80 truncate">{content.temples[0]?.name || 'N/A'}</p>
                <p className="text-xs text-muted-foreground mt-1">{content.temples[0]?.followers.toLocaleString() || 0} followers</p>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
