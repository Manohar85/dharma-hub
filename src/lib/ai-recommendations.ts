/**
 * AI-Powered Recommendation Engine
 * Personalizes content based on user preferences, engagement history, and behavior
 */

import { supabase } from '@/integrations/supabase/client';
import { MOCK_POSTS, MOCK_REELS, MOCK_MUSIC, MOCK_TEMPLES } from './constants';

export interface ScoredItem<T> {
  item: T;
  score: number;
  reasons: string[];
}

export interface UserEngagement {
  likedPosts: string[];
  likedReels: string[];
  viewedPosts: string[];
  viewedReels: string[];
  playedMusic: string[];
}

/**
 * Get user engagement history from localStorage
 */
export function getUserEngagement(): UserEngagement {
  try {
    const stored = localStorage.getItem('user-engagement');
    return stored ? JSON.parse(stored) : {
      likedPosts: [],
      likedReels: [],
      viewedPosts: [],
      viewedReels: [],
      playedMusic: []
    };
  } catch {
    return {
      likedPosts: [],
      likedReels: [],
      viewedPosts: [],
      viewedReels: [],
      playedMusic: []
    };
  }
}

/**
 * Update user engagement
 */
export function updateUserEngagement(type: keyof UserEngagement, itemId: string) {
  const engagement = getUserEngagement();
  if (!engagement[type].includes(itemId)) {
    engagement[type].push(itemId);
    localStorage.setItem('user-engagement', JSON.stringify(engagement));
  }
}

/**
 * AI ranking algorithm for posts
 */
export async function getRecommendedPosts(
  state: string,
  language: string,
  deity: string,
  zodiacSign: string,
  limit: number = 10
): Promise<ScoredItem<any>[]> {
  const cacheKey = `recommended-posts-${state}-${language}-${deity}-${zodiacSign}`;
  const cacheTime = Date.now() - (6 * 60 * 60 * 1000); // 6 hours cache
  
  // Check cache (refresh every 6 hours)
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.timestamp > cacheTime) {
        return data.posts;
      }
    } catch {
      // Invalid cache
    }
  }

  const engagement = getUserEngagement();
  
  try {
    // Fetch from Supabase
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const postsData = posts || [];
    const allPosts = postsData.length > 0 ? postsData : MOCK_POSTS;

    // Score each post
    const scored: ScoredItem<any>[] = allPosts.map(post => {
      let score = 0;
      const reasons: string[] = [];

      // Region match (high weight)
      if (post.region === state) {
        score += 30;
        reasons.push('From your region');
      }

      // Language match
      if (post.language === language) {
        score += 20;
        reasons.push('In your language');
      }

      // Deity match (high weight)
      if (post.deity === deity) {
        score += 25;
        reasons.push(`Related to ${deity}`);
      }

      // Engagement history (liked content from similar creators)
      if (engagement.likedPosts.includes(post.id)) {
        score += 15;
        reasons.push('You liked this');
      }

      // Popularity boost
      const likes = post.likes_count || post.likes || 0;
      score += Math.min(likes / 100, 10);
      if (likes > 1000) reasons.push('Popular');

      // Recency boost
      const daysAgo = post.created_at 
        ? (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60 * 24)
        : 30;
      if (daysAgo < 1) score += 5;
      if (daysAgo < 7) score += 3;

      // Zodiac-based mood boost (Leo = bold, confident content)
      if (zodiacSign === 'leo' && likes > 500) {
        score += 5;
        reasons.push('Trending');
      }

      return {
        item: {
          id: post.id,
          caption: post.caption,
          mediaUrl: post.media_url || post.mediaUrl,
          likes: post.likes_count || post.likes || 0,
          comments: post.comments_count || post.comments || 0,
          createdAt: post.created_at || post.timeAgo,
          region: post.region,
          deity: post.deity,
          language: post.language
        },
        score,
        reasons
      };
    });

    // Sort by score and return top items
    const result = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache result
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      posts: result
    }));

    return result;

  } catch (error) {
    console.warn('Error fetching recommended posts:', error);
    return [];
  }
}

/**
 * AI ranking algorithm for reels
 */
export async function getRecommendedReels(
  state: string,
  language: string,
  deity: string,
  limit: number = 10
): Promise<ScoredItem<any>[]> {
  const cacheKey = `recommended-reels-${state}-${language}-${deity}`;
  const cacheTime = Date.now() - (6 * 60 * 60 * 1000); // 6 hours cache
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.timestamp > cacheTime) {
        return data.reels;
      }
    } catch {
      // Invalid cache
    }
  }

  const engagement = getUserEngagement();

  try {
    const { data: reels, error } = await supabase
      .from('reels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const reelsData = reels || [];
    const allReels = reelsData.length > 0 ? reelsData : MOCK_REELS;

    const scored: ScoredItem<any>[] = allReels.map(reel => {
      let score = 0;
      const reasons: string[] = [];

      // Region match
      if (reel.region === state) {
        score += 30;
        reasons.push('Regional content');
      }

      // Deity match
      if (reel.deity === deity) {
        score += 25;
        reasons.push(`Devotional: ${deity}`);
      }

      // Engagement history
      if (engagement.likedReels.includes(reel.id)) {
        score += 20;
        reasons.push('You liked this');
      }

      if (engagement.viewedReels.includes(reel.id)) {
        score -= 10; // Reduce score for already viewed
      }

      // Views/popularity
      const views = reel.views_count || reel.views || 0;
      score += Math.min(views / 1000, 15);
      if (views > 10000) reasons.push('Viral');

      // Likes ratio
      const likes = reel.likes_count || reel.likes || 0;
      const likeRatio = views > 0 ? (likes / views) * 100 : 0;
      if (likeRatio > 5) {
        score += 10;
        reasons.push('Highly engaging');
      }

      // Recency
      const daysAgo = reel.created_at 
        ? (Date.now() - new Date(reel.created_at).getTime()) / (1000 * 60 * 60 * 24)
        : 30;
      if (daysAgo < 1) score += 5;

      return {
        item: {
          id: reel.id,
          caption: reel.caption,
          thumbnail: reel.thumbnail_url || reel.thumbnail,
          videoUrl: reel.video_url,
          views: views,
          likes: likes,
          music: reel.music_id || reel.music,
          createdAt: reel.created_at,
          region: reel.region,
          deity: reel.deity
        },
        score,
        reasons
      };
    });

    const result = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache result
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      reels: result
    }));

    return result;

  } catch (error) {
    console.warn('Error fetching recommended reels:', error);
    return [];
  }
}

/**
 * AI music recommendation based on time, mood, deity, and zodiac
 */
export async function getRecommendedMusic(
  state: string,
  language: string,
  deity: string,
  zodiacSign: string,
  limit: number = 10
): Promise<ScoredItem<any>[]> {
  const cacheKey = `recommended-music-${state}-${language}-${deity}-${zodiacSign}`;
  const cacheTime = Date.now() - (6 * 60 * 60 * 1000); // 6 hours cache
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.timestamp > cacheTime) {
        return data.music;
      }
    } catch {
      // Invalid cache
    }
  }

  const engagement = getUserEngagement();
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  try {
    const { data: music, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const musicData = music || [];
    const allMusic = musicData.length > 0 ? musicData : MOCK_MUSIC;

    const scored: ScoredItem<any>[] = allMusic.map(track => {
      let score = 0;
      const reasons: string[] = [];

      // Deity match (highest priority)
      if (track.deity === deity) {
        score += 40;
        reasons.push(`Your deity: ${deity}`);
      }

      // Region match
      if (track.region === state) {
        score += 25;
        reasons.push('Regional music');
      }

      // Language match
      if (track.language === language) {
        score += 20;
        reasons.push('In your language');
      }

      // Time-based recommendations
      const isMorning = timeOfDay === 'morning';
      const isEvening = timeOfDay === 'evening';
      
      if (isMorning && (track.category === 'aarti' || track.title.toLowerCase().includes('aarti'))) {
        score += 15;
        reasons.push('Morning aarti');
      }
      
      if (isEvening && (track.category === 'bhajan' || track.title.toLowerCase().includes('bhajan'))) {
        score += 15;
        reasons.push('Evening bhajan');
      }

      // Play history (favor less played)
      if (!engagement.playedMusic.includes(track.id)) {
        score += 10;
        reasons.push('New for you');
      } else {
        score -= 5; // Slight penalty for already played
      }

      // Popularity
      const plays = track.play_count || track.plays || 0;
      score += Math.min(plays / 50000, 10);
      if (plays > 500000) reasons.push('Popular');

      // Zodiac-based mood
      if (zodiacSign === 'leo') {
        if (track.title.toLowerCase().includes('power') || track.title.toLowerCase().includes('victory')) {
          score += 5;
        }
      }

      return {
        item: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          coverUrl: track.cover_url || track.coverUrl,
          duration: track.duration,
          plays: plays,
          region: track.region,
          deity: track.deity,
          language: track.language
        },
        score,
        reasons
      };
    });

    const result = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache result
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      music: result
    }));

    return result;

  } catch (error) {
    console.warn('Error fetching recommended music:', error);
    return [];
  }
}

/**
 * Get daily recommended bhajan (single track)
 */
export async function getDailyBhajan(
  state: string,
  language: string,
  deity: string,
  zodiacSign: string
): Promise<any | null> {
  const cacheKey = `daily-bhajan-${state}-${language}-${deity}-${zodiacSign}`;
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.date === today) {
        return data.bhajan;
      }
    } catch {
      // Invalid cache
    }
  }

  const recommendations = await getRecommendedMusic(state, language, deity, zodiacSign, 1);
  const bhajan = recommendations.length > 0 ? recommendations[0].item : null;

  // Cache for today
  if (bhajan) {
    localStorage.setItem(cacheKey, JSON.stringify({
      date: today,
      bhajan
    }));
  }

  return bhajan;
}

/**
 * AI temple recommendation
 */
export async function getRecommendedTemples(
  state: string,
  deity: string,
  limit: number = 5
): Promise<ScoredItem<any>[]> {
  try {
    const { data: temples, error } = await supabase
      .from('temples')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    const templesData = temples || [];
    const allTemples = templesData.length > 0 ? templesData : MOCK_TEMPLES;

    const today = new Date();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();

    const scored: ScoredItem<any>[] = allTemples.map(temple => {
      let score = 0;
      const reasons: string[] = [];

      // State match (highest priority)
      if (temple.state === state) {
        score += 50;
        reasons.push('In your state');
      }

      // Deity match
      if (temple.deity === deity) {
        score += 30;
        reasons.push(`Temple of ${deity}`);
      }

      // Festival match (boost during festivals)
      const festivals = temple.festivals || [];
      const isFestivalSeason = festivals.some((f: string) => {
        // Simple check - in production, use proper festival calendar
        return f.toLowerCase().includes('maha') || f.toLowerCase().includes('navratri');
      });
      if (isFestivalSeason) {
        score += 20;
        reasons.push('Festival season');
      }

      // Popularity
      const followers = temple.followers_count || temple.followers || 0;
      score += Math.min(followers / 10000, 10);
      if (followers > 50000) reasons.push('Popular temple');

      return {
        item: {
          id: temple.id,
          name: temple.name,
          location: temple.address || `${temple.district}, ${temple.state}`,
          image: temple.images?.[0] || temple.image || '',
          followers: followers,
          deity: temple.deity,
          state: temple.state,
          description: temple.description
        },
        score,
        reasons
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.warn('Error fetching recommended temples:', error);
    return [];
  }
}

/**
 * Get temple of the day
 */
export async function getTempleOfTheDay(
  state: string,
  deity: string
): Promise<any | null> {
  const cacheKey = `temple-of-day-${state}-${deity}`;
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.date === today) {
        return data.temple;
      }
    } catch {
      // Invalid cache
    }
  }

  const recommendations = await getRecommendedTemples(state, deity, 1);
  const temple = recommendations.length > 0 ? recommendations[0].item : null;

  // Cache for today
  if (temple) {
    localStorage.setItem(cacheKey, JSON.stringify({
      date: today,
      temple
    }));
  }

  return temple;
}
