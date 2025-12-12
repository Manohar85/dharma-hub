/**
 * API utilities for fetching personalized content
 * Handles regional trending content, devotional content, etc.
 */

import { supabase } from '@/integrations/supabase/client';
import { DEITIES, INDIAN_STATES, MOCK_MUSIC, MOCK_POSTS, MOCK_REELS, MOCK_TEMPLES } from './constants';

export interface TrendingContent {
  music: Array<{ id: string; title: string; artist: string; coverUrl: string; plays: number }>;
  posts: Array<{ id: string; caption: string; mediaUrl: string; likes: number }>;
  reels: Array<{ id: string; caption: string; thumbnail: string; views: number }>;
  temples: Array<{ id: string; name: string; location: string; image: string; followers: number }>;
}

/**
 * Get regional trending content
 */
export async function getRegionalTrending(
  state: string,
  language: string,
  deity: string
): Promise<TrendingContent> {
  const cacheKey = `trending-${state}-${language}-${deity}`;
  const today = new Date().toDateString();
  
  // Check cache (refresh daily)
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.date === today) {
        return data.content;
      }
    } catch {
      // Invalid cache, continue to fetch
    }
  }

  try {
    // Try to fetch from Supabase
    const [musicResult, postsResult, reelsResult, templesResult] = await Promise.all([
      supabase
        .from('music_tracks')
        .select('*')
        .eq('region', state)
        .order('play_count', { ascending: false })
        .limit(5),
      supabase
        .from('posts')
        .select('*')
        .eq('region', state)
        .order('likes_count', { ascending: false })
        .limit(5),
      supabase
        .from('reels')
        .select('*')
        .eq('region', state)
        .order('views_count', { ascending: false })
        .limit(5),
      supabase
        .from('temples')
        .select('*')
        .eq('state', state)
        .order('followers_count', { ascending: false })
        .limit(5)
    ]);

    const content: TrendingContent = {
      music: (musicResult.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist || 'Unknown',
        coverUrl: track.cover_url || '',
        plays: track.play_count || 0
      })),
      posts: (postsResult.data || []).map(post => ({
        id: post.id,
        caption: post.caption || '',
        mediaUrl: post.media_url || '',
        likes: post.likes_count || 0
      })),
      reels: (reelsResult.data || []).map(reel => ({
        id: reel.id,
        caption: reel.caption || '',
        thumbnail: reel.thumbnail_url || '',
        views: reel.views_count || 0
      })),
      temples: (templesResult.data || []).map(temple => ({
        id: temple.id,
        name: temple.name,
        location: temple.address || `${temple.district}, ${temple.state}`,
        image: temple.images?.[0] || '',
        followers: temple.followers_count || 0
      }))
    };

    // Fallback to mock data if Supabase is empty
    if (content.music.length === 0 || content.posts.length === 0) {
      return getMockRegionalTrending(state, language, deity);
    }

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      date: today,
      content
    }));

    return content;
  } catch (error) {
    console.warn('Error fetching trending content, using mock data:', error);
    return getMockRegionalTrending(state, language, deity);
  }
}

/**
 * Get mock regional trending content (fallback)
 */
function getMockRegionalTrending(
  state: string,
  language: string,
  deity: string
): TrendingContent {
  // Filter mock data by region, language, and deity
  const filteredMusic = MOCK_MUSIC
    .filter(m => m.region === state || m.language === language || m.deity === deity)
    .slice(0, 5);

  const filteredPosts = MOCK_POSTS
    .filter(p => p.region === state || p.language === language || p.deity === deity)
    .slice(0, 5);

  const filteredReels = MOCK_REELS
    .filter(r => r.region === state)
    .slice(0, 5);

  const filteredTemples = MOCK_TEMPLES
    .filter(t => t.state === state || t.deity === deity)
    .slice(0, 5);

  return {
    music: filteredMusic.map(m => ({
      id: m.id,
      title: m.title,
      artist: m.artist,
      coverUrl: m.coverUrl,
      plays: m.plays
    })),
    posts: filteredPosts.map(p => ({
      id: p.id,
      caption: p.caption,
      mediaUrl: p.mediaUrl,
      likes: p.likes
    })),
    reels: filteredReels.map(r => ({
      id: r.id,
      caption: r.caption,
      thumbnail: r.thumbnail,
      views: r.views
    })),
    temples: filteredTemples.map(t => ({
      id: t.id,
      name: t.name,
      location: t.location,
      image: t.image,
      followers: t.followers
    }))
  };
}

/**
 * Get user profile information
 */
export async function getUserProfile(userId?: string): Promise<{
  name: string;
  state: string;
  language: string;
  deity: string;
  zodiacSign: string;
} | null> {
  // For now, return null and use localStorage preferences
  // In production, this would fetch from Supabase
  return null;
}

/**
 * Get devotional quotes by deity
 */
export function getDevotionalQuotes(deity: string): string[] {
  const quotesByDeity: Record<string, string[]> = {
    shiva: [
      "Om Namah Shivaya - The sacred mantra that dissolves all limitations",
      "Shiva is the eternal consciousness - formless, infinite, and absolute",
      "In Shiva's meditation, find the peace that surpasses understanding"
    ],
    krishna: [
      "Radhe Krishna! Love is the highest form of devotion",
      "Krishna teaches: 'Do your work without attachment to results'",
      "The divine flute calls - listen with your heart, not your ears"
    ],
    vishnu: [
      "Om Namo Bhagavate Vasudevaya - Salutations to the all-pervading Vishnu",
      "Vishnu preserves and protects all who walk the path of dharma",
      "In Vishnu's cosmic form, see the infinite nature of the divine"
    ],
    ganesh: [
      "Ganapati Bappa Morya! Remover of all obstacles",
      "Ganesha's wisdom opens the door to all possibilities",
      "With Ganesha's grace, every journey becomes blessed"
    ],
    durga: [
      "Jai Mata Di! The divine mother protects and empowers",
      "Durga's strength is the strength of all mothers",
      "In Durga's fierce compassion, find your inner power"
    ],
    lakshmi: [
      "Om Shreem Mahalakshmiyei Namaha - Goddess of abundance",
      "Lakshmi blesses those who live with gratitude and generosity",
      "True wealth flows from inner abundance and service to others"
    ],
    other: [
      "The divine dwells within - recognize it, honor it, let it shine",
      "In devotion, we find the bridge between finite and infinite",
      "Every moment is an opportunity to connect with the divine"
    ]
  };

  return quotesByDeity[deity] || quotesByDeity.other;
}
