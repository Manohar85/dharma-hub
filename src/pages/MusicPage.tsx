import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Heart, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { getRecommendedMusic, ScoredItem, updateUserEngagement } from '@/lib/ai-recommendations';
import { INDIAN_STATES, DEITIES } from '@/lib/constants';
import { BottomNav } from '@/components/navigation/BottomNav';
import { PageHeader } from '@/components/navigation/PageHeader';
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

  return (
    <div className="min-h-screen bg-background pb-40">
      <PageHeader 
        title="Devotional Music" 
        subtitle={`${deityInfo?.icon || '🎵'} Regional music for ${stateName}`}
      />

      <main className="p-4 space-y-6">
        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-gold/10 to-accent/20 border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">AI-Curated For You</h2>
                  <p className="text-sm text-muted-foreground">
                    Based on your preferences and listening history
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Music List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4">
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
            <Card className="p-8 text-center">
              <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No music available yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for personalized devotional music
              </p>
            </Card>
          ) : (
            music.map((item, index) => (
              <motion.div
                key={item.item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`p-4 hover:shadow-soft transition-all cursor-pointer ${
                    isCurrentTrack(item.item.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handlePlay(item.item)}
                >
                  <div className="flex items-center gap-4">
                    {/* Album Art */}
                    <div className="relative flex-shrink-0">
                      {item.item.coverUrl ? (
                        <img
                          src={item.item.coverUrl}
                          alt={item.item.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-gold flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                      )}
                      {isTrackPlaying(item.item.id) && (
                        <motion.div
                          className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((bar) => (
                              <motion.div
                                key={bar}
                                className="w-1 bg-white rounded"
                                animate={{ height: [8, 16, 8] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: bar * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {isCurrentTrack(item.item.id) && playerLoading && (
                        <motion.div
                          className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </motion.div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.item.artist || 'Unknown Artist'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {item.item.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(item.item.duration)}
                          </span>
                        )}
                        <span>{(item.item.plays / 1000).toFixed(1)}K plays</span>
                      </div>
                      {item.reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.reasons.slice(0, 2).map((reason, i) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        className={`rounded-full ${
                          isTrackPlaying(item.item.id)
                            ? 'gradient-divine'
                            : 'gradient-saffron'
                        }`}
                        onClick={() => handlePlay(item.item)}
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
            ))
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
