/**
 * useNewsFeed.js
 * কাস্টম হুক: প্রতি ১ মিনিট (৬০ সেকেন্ড) পরপর শীর্ষ টিভি চ্যানেল থেকে নিউজ অটো-আপডেট,
 * লাইভ কাউন্টডাউন টাইমার, অডিও এলার্ট, ৬৪ জেলা কভারেজ এবং দিনভিত্তিক আর্কাইভ নিয়ন্ত্রণ করে।
 */

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_NEWS_EVENTS } from '../data/newsData';
import { 
  fetchLiveNewsUpdates, 
  enrichNewsWithChannels, 
  TOP_TV_CHANNELS 
} from '../services/newsFeedService';
import { fetchLiveRssNews } from '../services/liveRssService';
import { 
  getCompleteDistrictNewsCoverage, 
  formatDateKey 
} from '../services/districtNewsCoverageService';

// ওয়েব অডিও এপিআই দিয়ে আধুনিক ও মৃদু ব্রেকিং নিউজ নোটিফিকেশন চাইম
const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // ১ম টোন
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // ২য় টোন (উচ্চ স্বর)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.5);
    }, 120);
  } catch {
    // অডিও ব্লক থাকলে কোনো সমস্যা নেই
  }
};

export default function useNewsFeed() {
  const todayKey = formatDateKey(new Date());

  // ০. দিনভিত্তিক আর্কাইভ স্টেট
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  // ১. প্রাথমিক নিউজ ইভেন্টসমূহ টিভি চ্যানেল মেটাডাটাসহ প্রস্তুত করা
  const [newsEvents, setNewsEvents] = useState(() => enrichNewsWithChannels(INITIAL_NEWS_EVENTS));
  
  // ২. টাইমার ও রিফ্রেশ স্টেট
  const [nextRefreshIn, setNextRefreshIn] = useState(60); // ৬০ সেকেন্ড কাউন্টডাউন
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // ৩. নতুন আপডেট টোস্ট নোটিফিকেশন
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [latestBreakingHeadline, setLatestBreakingHeadline] = useState(null);
  const [isAudioAlertEnabled, setIsAudioAlertEnabled] = useState(true);

  // ৪. টিভি চ্যানেল ও মাধ্যম ফিল্টার স্টেট
  const [activeChannelId, setActiveChannelId] = useState('all');
  const [selectedSourceType, setSelectedSourceType] = useState('all'); // 'all' | 'youtube' | 'facebook_verified' | 'national_press'

  // নির্বাচিত তারিখ পরিবর্তন হলে সংশ্লিষ্ট দিনের ৬৪ জেলা কভারেজ লোড
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
        }
      } catch (err) {
        console.warn('Date coverage load failed:', err);
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }

    loadDateCoverage();
    return () => { isMounted = false; };
  }, [selectedDateKey]);

  // রিফ্রেশ এক্সিকিউশন হ্যান্ডলার (লাইভ আরএসএস + টিভি চ্যানেল আপডেট - শুধুমাত্র আজকের জন্য)
  const executeRefresh = useCallback(async () => {
    if (selectedDateKey !== todayKey) return; // পূর্ববর্তী দিনের খবরে অটো-রিফ্রেশ প্রয়োজন নেই

    setIsRefreshing(true);
    let addedCount = 0;

    try {
      // ১. রিয়েল লাইভ আরএসএস থেকে তাজা খবর ফেচ
      try {
        const liveItems = await fetchLiveRssNews();
        if (liveItems && liveItems.length > 0) {
          setNewsEvents(prev => {
            const existingTitles = new Set(prev.map(e => e.canonical_bangla_title));
            const newUnique = liveItems.filter(item => !existingTitles.has(item.canonical_bangla_title));
            if (newUnique.length > 0) {
              addedCount += newUnique.length;
              setLatestBreakingHeadline(newUnique[0].canonical_bangla_title);
              return [...newUnique, ...prev];
            }
            return prev;
          });
        }
      } catch (rssErr) {
        console.warn('Live RSS auto-update notice:', rssErr);
      }

      // ২. টিভি চ্যানেলের ডাইনামিক লাইভ আপডেট
      const { newEvent, timestamp } = await fetchLiveNewsUpdates();
      
      setNewsEvents(prev => {
        // ডুপ্লিকেট রোধ
        if (prev.some(item => item.canonical_bangla_title === newEvent.canonical_bangla_title)) {
          return prev;
        }
        addedCount += 1;
        setLatestBreakingHeadline(newEvent.canonical_bangla_title);
        return [newEvent, ...prev];
      });

      setLastUpdated(timestamp);
      if (addedCount > 0) {
        setNewItemsCount(prev => prev + addedCount);
        if (isAudioAlertEnabled) {
          playChimeSound();
        }
      }
      setNextRefreshIn(60); // টাইমার পুনরায় ৬০ সেকেন্ডে রিসেট
    } catch (err) {
      console.error('Error fetching live news:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDateKey, todayKey, isAudioAlertEnabled]);

  // প্রতি ১ সেকেন্ডে কাউন্টডাউন টিক (কেবল আজকের জন্য)
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

  // ম্যানুয়াল রিফ্রেশ বাটন হ্যান্ডলার
  const manualRefresh = useCallback(() => {
    executeRefresh();
  }, [executeRefresh]);

  // তারিখ পরিবর্তন হ্যান্ডলার
  const changeDateKey = useCallback((newKey) => {
    setSelectedDateKey(newKey);
    setNewItemsCount(0);
  }, []);

  // অটো-আপডেট পজ / রিজুউম টগল
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshActive(prev => !prev);
  }, []);

  // নতুন আইটেম দেখা হলে টোস্ট ক্লিয়ার
  const acknowledgeNewItems = useCallback(() => {
    setNewItemsCount(0);
    setLatestBreakingHeadline(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // চ্যানেল ও মাধ্যম ফিল্টার অনুসারে নিউজ ফিল্টার
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
