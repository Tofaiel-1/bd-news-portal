/**
 * useNewsFeed.js
 * কাস্টম হুক: প্রতি ১ মিনিট (৬০ সেকেন্ড) পরপর শীর্ষ পোর্টাল থেকে রিয়েল-টাইম নিউজ আপডেট,
 * লাইভ কাউন্টডাউন টাইমার, অডিও এলার্ট এবং দিনভিত্তিক আর্কাইভ নিয়ন্ত্রণ করে।
 */

import { useState, useEffect, useCallback } from 'react';
import {
  enrichNewsWithChannels,
  TOP_TV_CHANNELS
} from '../services/newsFeedService';
import { fetchLiveRssNews } from '../services/liveRssService';
import {
  getCompleteDistrictNewsCoverage,
  formatDateKey
} from '../services/districtNewsCoverageService';
import { getAccurateTimeAgo } from '../utils/dateUtils';

const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.5);
    }, 120);
  } catch {
    // অডিও ব্লক থাকলে নীরব
  }
};

export default function useNewsFeed() {
  const todayKey = formatDateKey(new Date());

  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [newsEvents, setNewsEvents] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [nextRefreshIn, setNextRefreshIn] = useState(60);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [newItemsCount, setNewItemsCount] = useState(0);
  const [latestBreakingHeadline, setLatestBreakingHeadline] = useState(null);
  const [isAudioAlertEnabled, setIsAudioAlertEnabled] = useState(true);

  const [activeChannelId, setActiveChannelId] = useState('all');
  const [selectedSourceType, setSelectedSourceType] = useState('all');

  // নির্বাচিত তারিখ পরিবর্তন হলে সংশ্লিষ্ট দিনের সংবাদ লোড
  useEffect(() => {
    let isMounted = true;
    async function loadDateCoverage() {
      setIsRefreshing(true);
      try {
        const fullCoverage = await getCompleteDistrictNewsCoverage(selectedDateKey);
        const enriched = enrichNewsWithChannels(fullCoverage);
        if (isMounted) {
          setNewsEvents(enriched);
          setLastUpdated(new Date());
          setIsInitialLoading(false);
        }
      } catch (err) {
        console.warn('Date coverage load failed:', err);
        if (isMounted) setIsInitialLoading(false);
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }

    loadDateCoverage();
    return () => { isMounted = false; };
  }, [selectedDateKey]);

  // প্রতি ৬০ সেকেন্ডে রিয়েল-টাইম লাইভ আপডেট (একটি মাত্র সিঙ্গেল এপিআই কল ও প্রকৃত রুট সময় অক্ষুণ্ণ)
  const executeRefresh = useCallback(async () => {
    if (selectedDateKey !== todayKey) return;

    setIsRefreshing(true);
    let addedCount = 0;

    try {
      const liveItems = await fetchLiveRssNews();
      if (Array.isArray(liveItems) && liveItems.length > 0) {
        setNewsEvents(prev => {
          const existingTitles = new Set(prev.map(e => e.canonical_bangla_title));
          const newUnique = liveItems.filter(item => !existingTitles.has(item.canonical_bangla_title));
          if (newUnique.length > 0) {
            addedCount = newUnique.length;
            setLatestBreakingHeadline(newUnique[0].canonical_bangla_title);
          }

          // বিদ্যমান আইটেমগুলোরও time_ago নতুন সময়ের সাপেক্ষে হালনাগাদ করা এবং নতুনগুলো যোগ করে সময়ানুসারে সাজানো
          const merged = [...newUnique, ...prev].map(evt => ({
            ...evt,
            time_ago: getAccurateTimeAgo(evt.published_at, evt.time_ago)
          }));
          merged.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
          return merged;
        });
      }

      setLastUpdated(new Date());
      if (addedCount > 0) {
        setNewItemsCount(prev => prev + addedCount);
        if (isAudioAlertEnabled) {
          playChimeSound();
        }
      }
      setNextRefreshIn(60);
    } catch (err) {
      console.error('Error refreshing live news:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDateKey, todayKey, isAudioAlertEnabled]);

  // কাউন্টডাউন টিক (কেবল আজকের জন্য)
  useEffect(() => {
    if (!isAutoRefreshActive || selectedDateKey !== todayKey) return;

    const timer = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          executeRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRefreshActive, selectedDateKey, todayKey, executeRefresh]);

  const manualRefresh = useCallback(() => {
    executeRefresh();
  }, [executeRefresh]);

  const changeDateKey = useCallback((newKey) => {
    setSelectedDateKey(newKey);
    setNewItemsCount(0);
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshActive(prev => !prev);
  }, []);

  const acknowledgeNewItems = useCallback(() => {
    setNewItemsCount(0);
    setLatestBreakingHeadline(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const channelFilteredEvents = useCallback((events) => {
    let list = events;
    if (activeChannelId && activeChannelId !== 'all') {
      list = list.filter(e => e.primarySource?.id === activeChannelId);
    }
    if (selectedSourceType && selectedSourceType !== 'all') {
      list = list.filter(e => e.sourceType === selectedSourceType);
    }
    return list;
  }, [activeChannelId, selectedSourceType]);

  return {
    newsEvents,
    isInitialLoading,
    channelFilteredEvents,
    activeChannelId,
    setActiveChannelId,
    selectedSourceType,
    setSelectedSourceType,
    channelsList: TOP_TV_CHANNELS,
    nextRefreshIn,
    isAutoRefreshActive,
    toggleAutoRefresh,
    isRefreshing,
    manualRefresh,
    lastUpdated,
    newItemsCount,
    latestBreakingHeadline,
    acknowledgeNewItems,
    isAudioAlertEnabled,
    setIsAudioAlertEnabled: () => setIsAudioAlertEnabled(prev => !prev),
    selectedDateKey,
    changeDateKey
  };
}
