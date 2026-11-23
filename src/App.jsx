import React, { useState, useEffect, useMemo } from 'react';
import Header, { toBanglaNumber } from './components/Header';
import BreakingTicker from './components/BreakingTicker';
import UnifiedFilterBar from './components/UnifiedFilterBar';
import TrendingBar from './components/TrendingBar';
import WeatherPrayerWidget from './components/WeatherPrayerWidget';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';
import DateArchiveBar from './components/DateArchiveBar';
import TopNewsShowcase from './components/TopNewsShowcase';
import LiveTvModal from './components/LiveTvModal';
import NewsRadioPlayer from './components/NewsRadioPlayer';
import NewsShortsModal from './components/NewsShortsModal';
import SocialCardModal from './components/SocialCardModal';
import EventDetailModal from './components/EventDetailModal';
import SearchModal from './components/SearchModal';
import VerificationLabModal from './components/VerificationLabModal';
import BriefingModal from './components/BriefingModal';
import CorrectionModal from './components/CorrectionModal';
import Footer from './components/Footer';

import useNewsFeed from './hooks/useNewsFeed';
import { formatDateKey, formatBanglaDateLabel } from './services/districtNewsCoverageService';
import { getTopImportantNews } from './services/importanceScoreService';
import { getSemanticNewsImage } from './services/newsCrawlerService';
import { BREAKING_TICKER_ITEMS } from './data/newsData';
import {
  CATEGORIES,
  VERIFICATION_STATUSES
} from './data/locations';

import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Filter,
  Bookmark,
  AlertOctagon,
  Layers,
  CheckCircle2,
  TrendingUp,
  FileText,
  ChevronRight,
  ExternalLink,
  Flame,
  Radio,
  ArrowRight,
  Tv,
  RotateCw,
  Bell,
  Globe,
  History
} from 'lucide-react';

export default function App() {
  // ১. ১-মিনিট লাইভ নিউজ ইঞ্জিন ও শীর্ষ টিভি চ্যানেল হুক
  const {
    newsEvents,
    channelFilteredEvents,
    activeChannelId,
    setActiveChannelId,
    selectedSourceType,
    setSelectedSourceType,
    channelsList,
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
    setIsAudioAlertEnabled,
    selectedDateKey,
    changeDateKey
  } = useNewsFeed();

  // পেজিনেশন স্টেট (ডিফল্ট ২৪টি - ১ স্ক্রিনে ২৪টি কার্ড অটো শো)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const todayKey = formatDateKey(new Date());
  const isViewingPastDate = selectedDateKey && selectedDateKey !== todayKey;

  // ডার্ক মোড / লাইট মোড থিম স্টেট
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bd_news_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('bd_news_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('bd_news_theme', 'light');
      }
    } catch (e) {
      console.warn('Dark mode sync error:', e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // ২. ফিল্টারিং ও ভৌগোলিক পরিধি স্টেট (শুধুমাত্র সারাদেশ ও আন্তর্জাতিক)
  const [selectedScope, setSelectedScope] = useState('all'); // 'all' | 'bangladesh' | 'international'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [activeFeedTab, setActiveFeedTab] = useState('all_verified'); // 'all_verified' | 'bangladesh' | 'international' | 'breaking' | 'disputed'
  const [selectedTrendingTag, setSelectedTrendingTag] = useState(null);

  // ৩. বুকমার্ক (LocalStorage)
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState(() => {
    try {
      const bMarks = localStorage.getItem('bd_bookmarks');
      return bMarks ? JSON.parse(bMarks) : ['evt-bd-2026-001'];
    } catch {
      return [];
    }
  });

  // ৪. সমস্ত মডাল স্টেটসমূহ
  const [detailModalEvent, setDetailModalEvent] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isVerificationLabOpen, setIsVerificationLabOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isLiveTvModalOpen, setIsLiveTvModalOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isShortsOpen, setIsShortsOpen] = useState(false);
  const [socialCardEvent, setSocialCardEvent] = useState(null);
  const [correctionEvent, setCorrectionEvent] = useState(null);

  // লোকাল স্টোরেজে বুকমার্ক সংরক্ষণ
  useEffect(() => {
    localStorage.setItem('bd_bookmarks', JSON.stringify(bookmarkedEventIds));
  }, [bookmarkedEventIds]);

  // বুকমার্ক টগল
  const handleToggleBookmark = (eventId) => {
    setBookmarkedEventIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  // প্রতিটি চ্যানেলে কয়টি নিউজ রয়েছে তার গণনা
  const eventsCountByChannel = useMemo(() => {
    const counts = {};
    newsEvents.forEach(e => {
      const chId = e.primarySource?.id;
      if (chId) counts[chId] = (counts[chId] || 0) + 1;
    });
    return counts;
  }, [newsEvents]);

  // সংগ্রহের মাধ্যম অনুসারে গণনা (ইউটিউব, ফেসবুক, জাতীয়)
  const sourceCounts = useMemo(() => {
    const counts = {};
    newsEvents.forEach(e => {
      const sType = e.sourceType || 'national_press';
      counts[sType] = (counts[sType] || 0) + 1;
    });
    return counts;
  }, [newsEvents]);

  // ব্রেকিং নিউজ গণনা
  const breakingCount = useMemo(() => {
    return newsEvents.filter(e => e.freshness === 'breaking').length;
  }, [newsEvents]);

  // ক্যাটাগরি অনুসারে মোট সংবাদের সংখ্যা রিয়েল-টাইম গণনা
  const categoryCounts = useMemo(() => {
    const counts = { all: newsEvents.length };
    newsEvents.forEach(e => {
      if (e.category) counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [newsEvents]);

  // সক্রিয় ফিল্টার সংখ্যা গণনা
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFeedTab !== 'all_verified') count++;
    if (selectedScope !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedSourceType !== 'all') count++;
    if (activeChannelId !== 'all') count++;
    if (selectedTrendingTag) count++;
    const todayKey = formatDateKey(new Date());
    if (selectedDateKey && selectedDateKey !== todayKey) count++;
    return count;
  }, [activeFeedTab, selectedScope, selectedCategory, selectedSourceType, activeChannelId, selectedTrendingTag, selectedDateKey]);

  // সকল ফিল্টার রিসেট হ্যান্ডলার
  const handleResetAllFilters = () => {
    setActiveFeedTab('all_verified');
    setSelectedScope('all');
    setSelectedCategory('all');
    setSelectedStatusFilter('all');
    setSelectedSourceType('all');
    setActiveChannelId('all');
    setSelectedTrendingTag(null);
    changeDateKey(formatDateKey(new Date()));
  };

  // বহু-মাত্রিক ফিল্টার করা সংবাদ তালিকা (সারাদেশ ও আন্তর্জাতিক ফোকাসড)
  const filteredEvents = useMemo(() => {
    // ক) চ্যানেল ফিল্টার
    let list = channelFilteredEvents(newsEvents);

    // খ) ট্রেন্ডিং ট্যাগ ফিল্টার
    if (selectedTrendingTag) {
      list = list.filter(evt =>
        (evt.canonical_bangla_title && evt.canonical_bangla_title.includes(selectedTrendingTag)) ||
        (evt.summary_bangla && evt.summary_bangla.includes(selectedTrendingTag)) ||
        (evt.category && evt.category.includes(selectedTrendingTag))
      );
    }

    // গ) পরিধি, ক্যাটাগরি ও স্ট্যাটাস ফিল্টার
    return list.filter(evt => {
      const isIntl = evt.scope === 'international' || evt.category === 'আন্তর্জাতিক ও বিশ্ব';

      // ভৌগোলিক পরিধি ফিল্টার
      if (selectedScope === 'bangladesh' || activeFeedTab === 'bangladesh') {
        if (isIntl) return false;
      }
      if (selectedScope === 'international' || activeFeedTab === 'international') {
        if (!isIntl) return false;
      }

      // ক্যাটাগরি ফিল্টার
      if (selectedCategory !== 'all') {
        if (evt.category !== selectedCategory) return false;
      }

      // স্ট্যাটাস ফিল্টার
      if (selectedStatusFilter !== 'all') {
        if (evt.status !== selectedStatusFilter) return false;
      }

      // ফিড ট্যাব ফিল্টার
      if (activeFeedTab === 'disputed') {
        if (evt.status !== 'conflicting_reports') return false;
      } else if (activeFeedTab === 'breaking') {
        if (evt.freshness !== 'breaking') return false;
      }

      return true;
    });
  }, [newsEvents, channelFilteredEvents, selectedTrendingTag, selectedScope, selectedCategory, selectedStatusFilter, activeFeedTab]);

  // ফিল্টার বা তারিখ পরিবর্তিত হলে ১ম পৃষ্ঠায় রিসেট
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedScope, selectedCategory, selectedStatusFilter, activeFeedTab, selectedTrendingTag, selectedDateKey, activeChannelId, selectedSourceType]);

  // শীর্ষ গুরুত্বপূর্ণ সংবাদ তালিকা (সর্বোচ্চ গুরুত্বের ৭টি সংবাদ)
  const topImportantNews = useMemo(() => {
    return getTopImportantNews(filteredEvents, 7);
  }, [filteredEvents]);

  // প্রধান ফিচার্ড স্টোরি (হিরো)
  const featuredStory = topImportantNews[0] || filteredEvents[0];

  // বাকি সাধারণ স্টোরিসমূহ (টপ ৭টি সংবাদ বাদে বাকিগুলো পেজিনেশন ও ৬-কার্ড গ্রিডের জন্য)
  const topNewsIds = useMemo(() => new Set(topImportantNews.map(e => e.id)), [topImportantNews]);
  const regularStories = useMemo(() => {
    if (filteredEvents.length <= topImportantNews.length) return filteredEvents;
    const remaining = filteredEvents.filter(e => !topNewsIds.has(e.id));
    return remaining.length > 0 ? remaining : filteredEvents;
  }, [filteredEvents, topImportantNews, topNewsIds]);

  // পেজিনেশন অনুযায়ী বর্তমান পৃষ্ঠার সংবাদ টুকরো
  const totalPages = Math.max(1, Math.ceil(regularStories.length / pageSize));
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return regularStories.slice(start, start + pageSize);
  }, [regularStories, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/15 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-[#1E293B] dark:text-stone-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">

      {/* ১. শীর্ষ হেডার বার */}
      <Header
        selectedScope={selectedScope}
        onSelectScope={(scope) => {
          setSelectedScope(scope);
          setActiveFeedTab(scope === 'all' ? 'all_verified' : scope);
        }}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenVerificationLab={() => setIsVerificationLabOpen(true)}
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onOpenLiveTvModal={() => setIsLiveTvModalOpen(true)}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenShorts={() => setIsShortsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* ২. লাইভ ব্রেকিং নিউজ টিকার (অটো-রিফ্রেশ ও সাউন্ড কন্ট্রোল সমন্বিত) */}
      <BreakingTicker
        items={BREAKING_TICKER_ITEMS}
        onSelectEvent={(eventId) => {
          const evt = newsEvents.find(e => e.id === eventId);
          if (evt) setDetailModalEvent(evt);
        }}
        nextRefreshIn={nextRefreshIn}
        onManualRefresh={manualRefresh}
        isRefreshing={isRefreshing}
        isAudioAlertEnabled={isAudioAlertEnabled}
        onToggleAudio={() => setIsAudioAlertEnabled(prev => !prev)}
      />

      {/* নতুন লাইভ আপডেট এলে ফ্লোটিং নোটিফিকেশন ব্যানার */}
      {newItemsCount > 0 && (
        <div
          onClick={acknowledgeNewItems}
          className="sticky top-20 z-30 mx-auto mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-2xl flex items-center gap-3 cursor-pointer animate-bounce border-2 border-white/50 hover:scale-105 transition-transform"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="text-xs font-extrabold font-sans">
            🔔 {toBanglaNumber(newItemsCount)}টি নতুন টিভি নিউজ আপডেট হয়েছে!
          </span>
          <span className="text-[11px] bg-white text-rose-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
            এখনই দেখুন ↑
          </span>
        </div>
      )}

      {/* প্রধান কন্টেন্ট এরিয়া */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex-1 space-y-6 sm:space-y-7 w-full">

        {/* ৯. শীর্ষ গুরুত্বপূর্ণ সংবাদ শোকেস (টপ ৭টি সংবাদ বেন্টো গ্রিড) */}
        {topImportantNews.length > 0 ? (
          <TopNewsShowcase
            topNews={topImportantNews}
            onOpenDetail={(evt) => setDetailModalEvent(evt)}
            bookmarkedEventIds={bookmarkedEventIds}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          <div className="p-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-stone-500 text-sm font-medium">নির্বাচিত ফিল্টারে এই মুহূর্তে কোনো সংবাদ নেই।</p>
            <button
              onClick={handleResetAllFilters}
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* ১০. জাতীয় পরিস্থিতি পর্যবেক্ষণ ও লাইভ বুলেটিন প্যানেল (বেন্টো গ্রিড) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-newspaper dark:shadow-2xl border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs sm:text-[13px] font-bold tracking-wide text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                  জাতীয় সংবাদ ও পরিস্থিতি পর্যবেক্ষণ
                </span>
                <span className="font-serif text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  ২৪/৭ লাইভ
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 dark:text-stone-50 mt-3 leading-snug">
                {selectedScope === 'international' ? 'আন্তর্জাতিক ও বিশ্ব সংবাদ নেটওয়ার্ক' : 'সারাদেশ ও জাতীয় সংবাদ পর্যবেক্ষণ'}
              </h3>
              <p className="font-serif text-sm sm:text-[15px] text-stone-700 dark:text-stone-200 mt-2.5 leading-relaxed font-normal">
                {selectedScope === 'international'
                  ? 'বিশ্বের প্রভাবশালী গণমাধ্যম (বিবিসি, ডেইলি স্টার, বিডিনিউজ) থেকে আন্তর্জাতিক ও ভূ-রাজনীতির সর্বশেষ বিশ্লেষণ লাইভ আপডেট হচ্ছে।'
                  : 'সমগ্র বাংলাদেশের প্রধান প্রধান জাতীয় গণমাধ্যম ও টিভি চ্যানেলের সর্বশেষ সত্যতা যাচাইকৃত তথ্য লাইভ একত্রিত হচ্ছে।'}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">সক্রিয় সোর্স:</span>
                  <span className="font-serif font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">১০+ মিডিয়া</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">অটো-রিফ্রেশ:</span>
                  <span className="font-serif font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">১ মিনিটে সিঙ্ক</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">গুজব রোধ:</span>
                  <span className="font-serif font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">৯৯.২% নির্ভুল</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => { setSelectedScope('bangladesh'); setActiveFeedTab('bangladesh'); }}
                  className={"py-2 px-2 rounded-xl font-serif font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border " + (selectedScope === 'bangladesh'
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                    )}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>🇧🇩 সারাদেশ</span>
                </button>
                <button
                  onClick={() => { setSelectedScope('international'); setActiveFeedTab('international'); }}
                  className={"py-2 px-2 rounded-xl font-serif font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border " + (selectedScope === 'international'
                      ? 'bg-sky-700 text-white border-sky-600 shadow-md ring-2 ring-sky-500/30'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                    )}
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>🌍 আন্তর্জাতিক</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-3xl bg-emerald-50/90 dark:bg-stone-900 border border-emerald-300 dark:border-stone-800 flex flex-col justify-between gap-4 shadow-sm transition-colors">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-emerald-950 dark:text-emerald-300">
                    দৈনিক সংবাদ বুলেটিন
                  </h4>
                  <p className="font-serif text-xs font-bold text-emerald-800 dark:text-stone-300">
                    সারাদেশ ও বিশ্বের তাজা সারাংশ
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                আজকের দিনের প্রধান প্রধান আলোচিত ঘটনা, রাজনৈতিক সিদ্ধান্ত ও আন্তর্জাতিক খবরের এক নজরে এআই সারসংক্ষেপ পড়ুন।
              </p>
            </div>
            <button
              onClick={() => setIsBriefingModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-serif text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>আজকের বুলেটিন পড়ুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* ৭. একক সমন্বিত ফিল্টার বার (ট্যাব, ড্রপডাউন ও ক্যাটাগরি পিলস) */}
        <UnifiedFilterBar
          activeFeedTab={activeFeedTab}
          onSelectFeedTab={(tabId) => {
            setActiveFeedTab(tabId);
            if (tabId === 'bangladesh') setSelectedScope('bangladesh');
            else if (tabId === 'international') setSelectedScope('international');
            else if (tabId === 'all_verified') setSelectedScope('all');
          }}
          selectedScope={selectedScope}
          onSelectScope={(scope) => {
            setSelectedScope(scope);
            if (scope === 'bangladesh') setActiveFeedTab('bangladesh');
            else if (scope === 'international') setActiveFeedTab('international');
            else setActiveFeedTab('all_verified');
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
          selectedDateKey={selectedDateKey}
          onSelectDateKey={(dKey) => changeDateKey(dKey)}
          selectedSourceType={selectedSourceType}
          onSelectSourceType={(type) => setSelectedSourceType(type)}
          activeChannelId={activeChannelId}
          onSelectChannel={(chId) => setActiveChannelId(chId)}
          onResetAllFilters={handleResetAllFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* ৮.১ ইউটিলিটি ও ইনফরমেশন বার (৩-কলাম বেন্টো গ্রিড: আবহাওয়া, ট্রেন্ডিং ও লাইভ টিভি) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ১. আবহাওয়া ও নামাজের সময়সূচী */}
          <WeatherPrayerWidget
            compact={true}
            divisionId="dhaka"
            districtBn="ঢাকা"
          />

          {/* ২. ট্রেন্ডিং টপিক ও হ্যাশট্যাগ */}
          <TrendingBar
            selectedTag={selectedTrendingTag}
            onSelectTag={(tag) => setSelectedTrendingTag(tag)}
          />

          {/* ৩. শীর্ষ টিভি চ্যানেল লাইভ স্ট্রিম দেখার ব্যানার */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 text-white shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                লাইভ টিভি হাব
              </span>
              <Tv className="w-4 h-4 text-white" />
            </div>

            <h4 className="font-serif text-lg font-black leading-snug">
              সময়, যমুনা, একাত্তর ও শীর্ষ চ্যানেল লাইভ দেখুন
            </h4>

            <p className="text-xs text-white/90 leading-relaxed font-medium">
              সরাসরি সম্প্রচার ও ব্রেকিং বুলেটিন এক ক্লিকে দেখার বিশেষ ব্যবস্থা।
            </p>

            <button
              onClick={() => setIsLiveTvModalOpen(true)}
              className="w-full py-2.5 rounded-2xl bg-white text-red-700 font-bold text-xs shadow-md hover:bg-stone-100 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Tv className="w-4 h-4 text-red-600" />
              <span>লাইভ সম্প্রচার চালু করুন</span>
            </button>
          </div>
        </section>

        {/* ৮.২ দিন, মাস ও বছর ভিত্তিক ঐতিহাসিক সংবাদ আর্কাইভ বার */}
        <DateArchiveBar
          selectedDateKey={selectedDateKey}
          onSelectDateKey={(k) => changeDateKey(k)}
          totalEventsForDate={regularStories.length + (featuredStory ? 1 : 0)}
        />

        {/* অতীত তারিখ নির্বাচনের ক্ষেত্রে বিশেষ আর্কাইভ নোটিশ ব্যানার */}
        {isViewingPastDate && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base block">
                  📅 আপনি বর্তমানে {formatBanglaDateLabel(selectedDateKey)} তারিখের সংরক্ষিত আর্কাইভ খবর দেখছেন
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  এই তারিখে সংরক্ষিত মোট {toBanglaNumber(regularStories.length + (featuredStory ? 1 : 0))}টি প্রতিবেদন রয়েছে • লাইভ অটো-আপডেট সাময়িক স্থগিত রয়েছে
                </span>
              </div>
            </div>
            <button
              onClick={() => changeDateKey(todayKey)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>আজকের তাজা লাইভ খবরে ফিরুন</span>
            </button>
          </div>
        )}

        {/* ৮.৩ প্রধান নিউজ ফিড (কম্প্যাক্ট ৩-কলাম বেন্টো গ্রিড - ১ স্ক্রিনে ৬টি কার্ড) */}
        <section id="news-feed-grid" className="w-full scroll-mt-24 space-y-4 pt-1">
          {/* নিউজ হেডার ও কাউন্টার */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-5 rounded-full bg-emerald-600" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {selectedScope === 'international' || activeFeedTab === 'international'
                  ? '🌍 আন্তর্জাতিক ও বিশ্ব সংবাদ ফিড'
                  : selectedScope === 'bangladesh' || activeFeedTab === 'bangladesh'
                    ? '🇧🇩 সারাদেশের প্রধান সংবাদ ও প্রতিবেদন'
                    : 'সারাদেশ ও আন্তর্জাতিক সকল সংবাদ'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {toBanglaNumber(regularStories.length)}টি খবর
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <span className="hidden sm:inline font-medium">১ স্ক্রিনে ৬টি কার্ড (৩x২)</span>
              <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                পৃষ্ঠা {toBanglaNumber(currentPage)} / {toBanglaNumber(totalPages)}
              </span>
            </div>
          </div>

          {paginatedStories.length > 0 ? (
            <>
              {/* ৩-কলাম রেসপনসিভ নিউজ গ্রিড (কম্প্যাক্ট কার্ড - ১ স্ক্রিনে ৬টি ভিউ) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
                {paginatedStories.map(evt => (
                  <NewsCard
                    key={evt.id}
                    event={evt}
                    onOpenDetail={(target) => setDetailModalEvent(target)}
                    isBookmarked={bookmarkedEventIds.includes(evt.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenSocialCard={(target) => setSocialCardEvent(target)}
                  />
                ))}
              </div>

              {/* পৃষ্ঠা ১, ২, ৩... প্রফেশনাল পেজিনেশন কন্ট্রোলার */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => setPageSize(newSize)}
                totalItems={regularStories.length}
                targetScrollId="news-feed-grid"
              />
            </>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                নির্বাচিত ফিল্টারে কোনো খবর পাওয়া যায়নি
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                আপনার নির্বাচিত গণমাধ্যম, উপজেলা বা ক্যাটাগরিতে এই মুহূর্তে নতুন কোনো ঘটনা নেই। ফিল্টার রিসেট করে সব খবর দেখতে পারেন।
              </p>
              <button
                onClick={handleResetAllFilters}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                সকল ফিল্টার মুছুন
              </button>
            </div>
          )}
        </section>

        {/* ৮.৩ সত্যতা যাচাই, ফ্যাক্ট-চেক ও সর্বাধিক সমর্থিত সংবাদ সেকশন (৩-কলাম বেন্টো) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {/* ফ্যাক্ট-চেক ও অসঙ্গতি সতর্কতা */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-newspaper space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                ফ্যাক্ট-চেক ও অসঙ্গতি সতর্কতা
              </h3>
            </div>
            {newsEvents.filter(e => e.status === 'conflicting_reports').slice(0, 2).map(dispute => (
              <div
                key={dispute.id}
                onClick={() => setDetailModalEvent(dispute)}
                className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 cursor-pointer hover:bg-rose-100/70 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
                  <span>{dispute.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ • বাংলাদেশ'}</span>
                  <span className="text-rose-700 font-mono font-bold">আস্থা: {dispute.confidence}%</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-rose-900 leading-snug">
                  {dispute.canonical_bangla_title}
                </h4>
                <p className="text-xs text-rose-950 font-medium line-clamp-2">
                  {dispute.conflicts?.[0]?.difference_bangla || dispute.summary_bangla}
                </p>
                <div className="text-xs font-bold text-rose-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>গুজব খণ্ডন বিশ্লেষণ পড়ুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* সর্বাধিক সমর্থিত সংবাদ */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-newspaper space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                সর্বাধিক স্বাধীন উৎস সমর্থিত সংবাদ
              </h3>
            </div>
            <div className="space-y-3">
              {newsEvents
                .filter(e => e.confidence >= 90)
                .slice(0, 3)
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setDetailModalEvent(item)}
                    className="cursor-pointer group flex items-start gap-2.5 pb-2.5 border-b border-stone-100 last:border-b-0 last:pb-0"
                  >
                    <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {item.canonical_bangla_title}
                      </h4>
                      <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5 font-medium">
                        <span className="font-bold text-emerald-800">{item.primarySource?.nameBn || (item.scope === 'international' ? 'আন্তর্জাতিক' : 'সারাদেশ')}</span>
                        <span>•</span>
                        <span className="font-bold text-stone-800">{item.independence.independent_source_count} উৎস</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* ভেরিফিকেশন ল্যাব ব্যানার কার্ড */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-indigo-950 text-white shadow-xl space-y-3 border border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">মাল্টি-সোর্স ইঞ্জিন</span>
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug mt-2">
                উপজেলা ভেরিফিকেশন ইঞ্জিন টেস্ট ল্যাব
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium mt-1">
                যেকোনো প্রেস রিলিজের সত্যতা, সিন্ডিকেশন ও মালিকানা গ্রুপ কৃত্রিম বুদ্ধিমত্তা দিয়ে অডিট করুন।
              </p>
            </div>
            <button
              onClick={() => setIsVerificationLabOpen(true)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>ল্যাবে প্রবেশ করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </main>

      {/* ১০. ফুটার */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* ১১. সমস্ত সক্রিয় মডালসমূহ */}
      {detailModalEvent && (
        <EventDetailModal
          event={detailModalEvent}
          onClose={() => setDetailModalEvent(null)}
          onOpenCorrection={(target) => setCorrectionEvent(target)}
          isBookmarked={bookmarkedEventIds.includes(detailModalEvent.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {isLiveTvModalOpen && (
        <LiveTvModal
          isOpen={isLiveTvModalOpen}
          onClose={() => setIsLiveTvModalOpen(false)}
        />
      )}

      {isSearchModalOpen && (
        <SearchModal
          events={newsEvents}
          onClose={() => setIsSearchModalOpen(false)}
          onOpenDetail={(evt) => setDetailModalEvent(evt)}
        />
      )}

      {isBriefingModalOpen && (
        <BriefingModal
          events={newsEvents}
          selectedScope={selectedScope}
          onClose={() => setIsBriefingModalOpen(false)}
        />
      )}

      {correctionEvent && (
        <CorrectionModal
          event={correctionEvent}
          onClose={() => setCorrectionEvent(null)}
        />
      )}

      {/* ১০. সার্বক্ষণিক বাংলা এআই রেডিও প্লেয়ার */}
      <NewsRadioPlayer
        events={filteredEvents}
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        onOpenDetail={(evt) => setDetailModalEvent(evt)}
      />

      {/* ১১. ৬০-সেকেন্ড নিউজ শর্টস মোডাল */}
      {isShortsOpen && (
        <NewsShortsModal
          isOpen={isShortsOpen}
          onClose={() => setIsShortsOpen(false)}
          events={filteredEvents}
          onOpenDetail={(evt) => setDetailModalEvent(evt)}
        />
      )}

      {/* ১২. ভাইরাল সোশ্যাল ফটো-কার্ড মোডাল */}
      {socialCardEvent && (
        <SocialCardModal
          event={socialCardEvent}
          isOpen={!!socialCardEvent}
          onClose={() => setSocialCardEvent(null)}
        />
      )}
    </div>
  );
}
