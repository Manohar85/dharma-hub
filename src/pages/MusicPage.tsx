import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Heart, Clock, Shuffle, SkipBack, SkipForward, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { getRecommendedMusic, ScoredItem, updateUserEngagement } from '@/lib/ai-recommendations';
import { INDIAN_STATES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

export default function MusicPage() {
  const { preferences } = useUserPreferences();
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    isLoading: playerLoading,
    playTrack, 
    togglePlayPause,
    seekPercent,
    pause 
  } = useAudioPlayerContext();
  
  const [music, setMusic] = useState<ScoredItem<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'foryou' | 'trending' | 'recent'>('foryou');

  const stateName = INDIAN_STATES.find(s => s.value === preferences.state)?.label || 'India';
  const deityInfo = DEITIES.find(d => d.value === preferences.deity);

  useEffect(() => {
    async function loadMusic() {
      try {
        const recommended = await getRecommendedMusic(
          preferences.state,
          preferences.language,
          preferences.deity,
          preferences.zodiacSign,
          20
        );
        setMusic(recommended);
      } catch (error) {
        console.error('Error loading music:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMusic();
  }, [preferences.state, preferences.language, preferences.deity, preferences.zodiacSign]);

  const handlePlay = (item: any) => {
    playTrack({
      id: item.id,
      title: item.title,
      artist: item.artist,
      coverUrl: item.coverUrl,
      fileUrl: item.fileUrl,
      duration: item.duration,
    });
    updateUserEngagement('playedMusic', item.id);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = music.findIndex(m => m.item.id === currentTrack.id);
    if (currentIndex < music.length - 1) {
      handlePlay(music[currentIndex + 1].item);
    }
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = music.findIndex(m => m.item.id === currentTrack.id);
    if (currentIndex > 0) {
      handlePlay(music[currentIndex - 1].item);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTrackPlaying = (trackId: string) => currentTrack?.id === trackId && isPlaying;
  const isCurrentTrack = (trackId: string) => currentTrack?.id === trackId;

  const tabs = [
    { id: 'foryou', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Volume2 },
    { id: 'recent', label: 'Recent', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-40">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 pt-12 pb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-display font-bold">Sacred Sounds</h1>
            <p className="text-muted-foreground mt-1">
              {deityInfo?.icon} Devotional music for {stateName}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Shuffle className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      <main className="relative z-10 px-4 space-y-6">
        {/* Featured Now Playing */}
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/20 via-gold/10 to-accent/20 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {currentTrack.coverUrl ? (
                      <motion.img
                        src={currentTrack.coverUrl}
                        alt={currentTrack.title}
                        className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <motion.div 
                        className="w-20 h-20 rounded-2xl gradient-divine flex items-center justify-center shadow-lg"
                        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Music className="w-10 h-10 text-primary-foreground" />
                      </motion.div>
                    )}
                    {isPlaying && (
                      <motion.div
                        className="absolute -inset-2 rounded-2xl border-2 border-primary/50"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">Now Playing</p>
                    <h3 className="font-display font-bold text-lg truncate">{currentTrack.title}</h3>
                    <p className="text-muted-foreground text-sm truncate">{currentTrack.artist || 'Unknown Artist'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePrevious}>
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="w-12 h-12 rounded-full gradient-saffron shadow-warm"
                      onClick={togglePlayPause}
                    >
                      {playerLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNext}>
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'gradient-saffron text-primary-foreground shadow-warm'
                  : 'bg-card hover:bg-muted border border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Music Grid */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </Card>
            ))
          ) : music.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Music className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">No Music Yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Devotional music for your region will be added soon
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {music.map((item, index) => (
                <motion.div
                  key={item.item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card 
                    className={`p-4 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all cursor-pointer group ${
                      isCurrentTrack(item.item.id) ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                    }`}
                    onClick={() => handlePlay(item.item)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Track Number / Album Art */}
                      <div className="relative flex-shrink-0">
                        {item.item.coverUrl ? (
                          <img
                            src={item.item.coverUrl}
                            alt={item.item.title}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-gold/30 flex items-center justify-center">
                            <span className="text-lg font-display font-bold text-primary">{index + 1}</span>
                          </div>
                        )}
                        
                        {/* Playing indicator overlay */}
                        <AnimatePresence>
                          {isTrackPlaying(item.item.id) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center"
                            >
                              <div className="flex gap-0.5 items-end h-4">
                                {[1, 2, 3].map((bar) => (
                                  <motion.div
                                    key={bar}
                                    className="w-1 bg-primary rounded-full"
                                    animate={{ height: ['30%', '100%', '50%', '80%', '30%'] }}
                                    transition={{
                                      duration: 0.8,
                                      repeat: Infinity,
                                      delay: bar * 0.1,
                                    }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Loading overlay */}
                        {isCurrentTrack(item.item.id) && playerLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center"
                          >
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </motion.div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${isCurrentTrack(item.item.id) ? 'text-primary' : ''}`}>
                          {item.item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.item.artist || 'Unknown Artist'}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {item.item.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(item.item.duration)}
                            </span>
                          )}
                          {item.reasons.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {item.reasons[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`rounded-full ${
                            isCurrentTrack(item.item.id)
                              ? 'text-primary'
                              : 'opacity-0 group-hover:opacity-100 transition-opacity'
                          }`}
                          onClick={() => isCurrentTrack(item.item.id) ? togglePlayPause() : handlePlay(item.item)}
                        >
                          {isCurrentTrack(item.item.id) && playerLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : isTrackPlaying(item.item.id) ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
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

      {/* Floating Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isLoading={playerLoading}
        onTogglePlayPause={togglePlayPause}
        onSeek={seekPercent}
        onNext={music.length > 1 ? handleNext : undefined}
        onPrevious={music.length > 1 ? handlePrevious : undefined}
        onClose={() => pause()}
      />

      <BottomNav />
    </div>
  );
}
