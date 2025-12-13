import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Heart, MessageCircle, Share2, Music, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { getRecommendedReels, ScoredItem, updateUserEngagement } from '@/lib/ai-recommendations';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function ReelsPage() {
  const { preferences } = useUserPreferences();
  const [reels, setReels] = useState<ScoredItem<any>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReels() {
      try {
        const recommended = await getRecommendedReels(
          preferences.state,
          preferences.language,
          preferences.deity,
          20
        );
        setReels(recommended);
        if (recommended.length > 0) {
          updateUserEngagement('viewedReels', recommended[0].item.id);
        }
      } catch (error) {
        console.error('Error loading reels:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReels();
  }, [preferences.state, preferences.language, preferences.deity]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < reels.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      updateUserEngagement('viewedReels', reels[newIndex].item.id);
    }
  };

  const handleLike = (reelId: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(reelId)) {
      newLiked.delete(reelId);
    } else {
      newLiked.add(reelId);
      updateUserEngagement('likedReels', reelId);
    }
    setLiked(newLiked);
  };

  const currentReel = reels[currentIndex]?.item;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <Video className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading reels...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="flex flex-col items-center justify-center h-[70vh] px-6">
          <Video className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No Reels Yet</h2>
          <p className="text-muted-foreground text-center">
            Devotional reels will appear here based on your preferences
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" ref={containerRef}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="relative h-screen"
        >
          {/* Video/Image Background */}
          <div className="absolute inset-0">
            {currentReel?.thumbnail ? (
              <img
                src={currentReel.thumbnail}
                alt={currentReel.caption || 'Reel'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                <Video className="w-24 h-24 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={() => handleScroll('up')}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white"
            >
              <ChevronUp className="w-8 h-8" />
            </button>
          )}
          {currentIndex < reels.length - 1 && (
            <button
              onClick={() => handleScroll('down')}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white animate-bounce"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          )}

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-40 flex flex-col items-center gap-6 z-20">
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={() => handleLike(currentReel.id)}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center ${
                liked.has(currentReel.id) ? 'text-red-500' : 'text-white'
              }`}>
                <Heart className={`w-6 h-6 ${liked.has(currentReel.id) ? 'fill-current' : ''}`} />
              </div>
              <span className="text-white text-xs mt-1">
                {(currentReel.likes || 0) + (liked.has(currentReel.id) ? 1 : 0)}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-white text-xs mt-1">0</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-white text-xs mt-1">Share</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 1.1 }}
              onClick={() => setMuted(!muted)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
            >
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-28 left-0 right-20 p-4 z-10">
            <h3 className="text-white font-bold text-lg mb-2">
              {currentReel?.caption || 'Devotional Reel'}
            </h3>
            
            {currentReel?.music && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Music className="w-4 h-4" />
                <span className="truncate">{currentReel.music}</span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
              <span>{(currentReel?.views / 1000).toFixed(1)}K views</span>
              {currentReel?.deity && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full">
                  {currentReel.deity}
                </span>
              )}
            </div>

            {reels[currentIndex]?.reasons?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {reels[currentIndex].reasons.slice(0, 2).map((reason, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/50 text-white px-2 py-0.5 rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4 z-20">
            {reels.slice(0, 10).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <BottomNav dark />
    </div>
  );
}
