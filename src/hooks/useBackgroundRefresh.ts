/**
 * Hook for background refresh of daily/weekly content
 * Automatically refreshes content at appropriate intervals
 */

import { useEffect, useCallback } from 'react';
import { clearOldCache, getDailySpiritualMessage, getWeeklyHoroscope, getDevotionalQuote } from '@/lib/ai-service';
import { getRecommendedPosts, getRecommendedReels, getRecommendedMusic, getRecommendedTemples, getDailyBhajan, getTempleOfTheDay } from '@/lib/ai-recommendations';
import { getTodayPanchangam } from '@/lib/panchangam';

interface UseBackgroundRefreshOptions {
  deity: string;
  zodiacSign: string;
  state: string;
  language: string;
  enabled?: boolean;
}

export function useBackgroundRefresh({ deity, zodiacSign, state, language, enabled = true }: UseBackgroundRefreshOptions) {
  const refreshDailyContent = useCallback(async () => {
    if (!enabled) return;
    
    try {
      // Pre-fetch and cache daily content
      await Promise.all([
        getDailySpiritualMessage(deity),
        getDevotionalQuote(deity),
        getTodayPanchangam(),
        getDailyBhajan(state, language, deity, zodiacSign),
        getTempleOfTheDay(state, deity)
      ]);
      
      // Clear old cache
      clearOldCache();
    } catch (error) {
      console.warn('Background refresh error:', error);
    }
  }, [deity, state, language, zodiacSign, enabled]);

  const refreshWeeklyContent = useCallback(async () => {
    if (!enabled) return;
    
    try {
      await getWeeklyHoroscope(zodiacSign);
    } catch (error) {
      console.warn('Weekly refresh error:', error);
    }
  }, [zodiacSign, enabled]);

  const refreshRecommendations = useCallback(async () => {
    if (!enabled) return;
    
    try {
      // Pre-fetch recommendations (cache for 6 hours)
      await Promise.all([
        getRecommendedPosts(state, language, deity, zodiacSign, 10),
        getRecommendedReels(state, language, deity, 10),
        getRecommendedMusic(state, language, deity, zodiacSign, 10),
        getRecommendedTemples(state, deity, 5)
      ]);
    } catch (error) {
      console.warn('Recommendations refresh error:', error);
    }
  }, [state, language, deity, zodiacSign, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Clear old cache on mount
    clearOldCache();

    // Refresh daily content every hour (to catch day transitions)
    const dailyInterval = setInterval(() => {
      refreshDailyContent();
    }, 60 * 60 * 1000); // 1 hour

    // Refresh weekly content every 6 hours (to catch week transitions)
    const weeklyInterval = setInterval(() => {
      refreshWeeklyContent();
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Refresh recommendations every 6 hours
    const recommendationsInterval = setInterval(() => {
      refreshRecommendations();
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Initial refresh
    refreshDailyContent();
    refreshWeeklyContent();
    refreshRecommendations();

    return () => {
      clearInterval(dailyInterval);
      clearInterval(weeklyInterval);
      clearInterval(recommendationsInterval);
    };
  }, [enabled, refreshDailyContent, refreshWeeklyContent, refreshRecommendations]);

  // Also refresh when visibility changes (user returns to tab)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshDailyContent();
        refreshWeeklyContent();
        refreshRecommendations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, refreshDailyContent, refreshWeeklyContent, refreshRecommendations]);
}
