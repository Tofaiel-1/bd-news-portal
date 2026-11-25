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
import BriefingModal from './components/BriefingModal';
import CorrectionModal from './components/CorrectionModal';
import Footer from './components/Footer';
import { HeroSkeleton, SkeletonCardGrid } from './components/NewsCardSkeleton';

import useNewsFeed from './hooks/useNewsFeed';
import { formatDateKey, formatBanglaDateLabel } from './services/districtNewsCoverageService';
import { getTopImportantNews } from './services/importanceScoreService';
import { getAccurateTimeAgo } from './utils/dateUtils';

import {
  Filter,
  Bookmark,
  TrendingUp,
  FileText,
  ChevronRight,
  Flame,
  ArrowRight,
  Tv,
  RotateCw,
  Globe,
  History,
  Newspaper
} from 'lucide-react';

export default function App() {
  const {
    newsEvents,
    isInitialLoading,
    channelFilteredEvents,
    activeChannelId,
    setActiveChannelId,
    selectedSourceType,
    setSelectedSourceType,
    nextRefreshIn,
    isRefreshing,
    manualRefresh,
    newItemsCount,
    acknowledgeNewItems,
    isAudioAlertEnabled,
    setIsAudioAlertEnabled,
    selectedDateKey,
    changeDateKey
  } = useNewsFeed();

  // পেজিনেশন স্টেট (ডিফল্ট ২৪টি - প্রতি স্ক্রিনে ২৪টি কার্ড)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const todayKey = formatDateKey(new Date());
  const isViewingPastDate = selectedDateKey && selectedDateKey !== todayKey;

  // ডার্ক মোড / লাইট মোড
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

  // ফিল্টারিং স্টেট
  const [selectedScope, setSelectedScope] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFeedTab, setActiveFeedTab] = useState('all_verified');
  const [selectedTrendingTag, setSelectedTrendingTag] = useState(null);

  // বুকমার্ক (LocalStorage)
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState(() => {
    try {
      const bMarks = localStorage.getItem('bd_bookmarks');
      return bMarks ? JSON.parse(bMarks) : [];
    } catch {
      return [];
    }
  });

  // সমস্ত সক্রিয় মডাল স্টেটসমূহ
  const [detailModalEvent, setDetailModalEvent] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isLiveTvModalOpen, setIsLiveTvModalOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isShortsOpen, setIsShortsOpen] = useState(false);
  const [socialCardEvent, setSocialCardEvent] = useState(null);
  const [correctionEvent, setCorrectionEvent] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('bd_bookmarks', JSON.stringify(bookmarkedEventIds));
    } catch {}
  }, [bookmarkedEventIds]);

  const handleToggleBookmark = (eventId) => {
    setBookmarkedEventIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  // লাইভ ব্রেকিং টিকার আইটেমসমূহ (তাজা ও বর্তমান খবর থেকে স্বয়ংক্রিয়ভাবে প্রস্তুত)
  const liveTickerItems = useMemo(() => {
    return newsEvents.slice(0, 12).map((item, idx) => ({
      id: `brk-${item.id || idx}`,
      eventId: item.id,
      textBn: item.canonical_bangla_title,
      tagBn: item.primarySource?.nameBn || 'সর্বশেষ',
      type: item.freshness === 'breaking' ? 'conflict' : 'official'
    }));
  }, [newsEvents]);

  // ক্যাটাগরি অনুসারে সংবাদের সংখ্যা (NFC normalized)
  const categoryCounts = useMemo(() => {
    const counts = { all: newsEvents.length };
    newsEvents.forEach(e => {
      if (e.category) {
        const normCat = e.category.normalize('NFC');
        counts[normCat] = (counts[normCat] || 0) + 1;
      }
    });
    return counts;
  }, [newsEvents]);

  // সক্রিয় ফিল্টার সংখ্যা
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFeedTab !== 'all_verified') count++;
    if (selectedScope !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedSourceType !== 'all') count++;
    if (activeChannelId !== 'all') count++;
    if (selectedTrendingTag) count++;
    const currentToday = formatDateKey(new Date());
    if (selectedDateKey && selectedDateKey !== currentToday) count++;
    return count;
  }, [activeFeedTab, selectedScope, selectedCategory, selectedSourceType, activeChannelId, selectedTrendingTag, selectedDateKey]);

  const handleResetAllFilters = () => {
    setActiveFeedTab('all_verified');
    setSelectedScope('all');
    setSelectedCategory('all');
    setSelectedSourceType('all');
    setActiveChannelId('all');
    setSelectedTrendingTag(null);
    changeDateKey(formatDateKey(new Date()));
  };

  // বহু-মাত্রিক ফিল্টার করা সংবাদ তালিকা
  const filteredEvents = useMemo(() => {
    let list = channelFilteredEvents(newsEvents);

    if (selectedTrendingTag) {
      const q = selectedTrendingTag.toLowerCase();
      list = list.filter(evt =>
        (evt.canonical_bangla_title && evt.canonical_bangla_title.toLowerCase().includes(q)) ||
        (evt.summary_bangla && evt.summary_bangla.toLowerCase().includes(q)) ||
        (evt.category && evt.category.toLowerCase().includes(q))
      );
    }

    const normSelCat = (selectedCategory || 'all').normalize('NFC');

    return list.filter(evt => {
      const isIntl = evt.scope === 'international' || (evt.category || '').normalize('NFC') === 'আন্তর্জাতিক ও বিশ্ব';

      if (selectedScope === 'bangladesh' || activeFeedTab === 'bangladesh') {
        if (isIntl) return false;
      }
      if (selectedScope === 'international' || activeFeedTab === 'international') {
        if (!isIntl) return false;
      }

      if (normSelCat !== 'all') {
        if ((evt.category || '').normalize('NFC') !== normSelCat) return false;
      }

      if (activeFeedTab === 'breaking') {
        if (evt.freshness !== 'breaking') return false;
      }

      return true;
    });
  }, [newsEvents, channelFilteredEvents, selectedTrendingTag, selectedScope, selectedCategory, activeFeedTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedScope, selectedCategory, activeFeedTab, selectedTrendingTag, selectedDateKey, activeChannelId, selectedSourceType]);

  // শীর্ষ গুরুত্বপূর্ণ সংবাদ তালিকা (টপ ৭টি)
  const topImportantNews = useMemo(() => {
    return getTopImportantNews(filteredEvents, 7);
  }, [filteredEvents]);

  const topNewsIds = useMemo(() => new Set(topImportantNews.map(e => e.id)), [topImportantNews]);
  const regularStories = useMemo(() => {
    if (filteredEvents.length <= topImportantNews.length) return filteredEvents;
    const remaining = filteredEvents.filter(e => !topNewsIds.has(e.id));
    return remaining.length > 0 ? remaining : filteredEvents;
  }, [filteredEvents, topImportantNews, topNewsIds]);

  const totalPages = Math.max(1, Math.ceil(regularStories.length / pageSize));
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return regularStories.slice(start, start + pageSize);
  }, [regularStories, currentPage, pageSize]);

  // সংরক্ষিত ও ডাইজেস্ট লিস্ট
  const bookmarkedEvents = useMemo(() => {
    return newsEvents.filter(e => bookmarkedEventIds.includes(e.id));
  }, [newsEvents, bookmarkedEventIds]);

  const internationalDigest = useMemo(() => {
    return newsEvents.filter(e => e.scope === 'international' || e.category === 'আন্তর্জাতিক ও বিশ্ব').slice(0, 3);
  }, [newsEvents]);

  const nationalDigest = useMemo(() => {
    return newsEvents.filter(e => e.scope !== 'international' && e.category !== 'আন্তর্জাতিক ও বিশ্ব').slice(0, 3);
  }, [newsEvents]);

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
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onOpenLiveTvModal={() => setIsLiveTvModalOpen(true)}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenShorts={() => setIsShortsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* ২. লাইভ ব্রেকিং নিউজ টিকার */}
      <BreakingTicker
        items={liveTickerItems}
        onSelectEvent={(eventId) => {
          const evt = newsEvents.find(e => e.id === eventId);
          if (evt) setDetailModalEvent(evt);
        }}
        nextRefreshIn={nextRefreshIn}
        onManualRefresh={manualRefresh}
        isRefreshing={isRefreshing}
        isAudioAlertEnabled={isAudioAlertEnabled}
        onToggleAudio={setIsAudioAlertEnabled}
      />

      {/* নতুন লাইভ আপডেট নোটিফিকেশন ব্যানার */}
      {newItemsCount > 0 && (
        <div
          onClick={acknowledgeNewItems}
          className="sticky top-20 z-30 mx-auto mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-2xl flex items-center gap-3 cursor-pointer animate-bounce border-2 border-white/50 hover:scale-105 transition-transform"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="text-xs font-extrabold font-sans">
            🔔 {toBanglaNumber(newItemsCount)}টি নতুন সংবাদ যুক্ত হয়েছে!
          </span>
          <span className="text-[11px] bg-white text-rose-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
            এখনই দেখুন ↑
          </span>
        </div>
      )}

      {/* প্রধান কন্টেন্ট এরিয়া */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex-1 space-y-6 sm:space-y-7 w-full">

        {/* শীর্ষ গুরুত্বপূর্ণ সংবাদ শোকেস */}
        {isInitialLoading && newsEvents.length === 0 ? (
          <HeroSkeleton />
        ) : topImportantNews.length > 0 ? (
          <TopNewsShowcase
            topNews={topImportantNews}
            onOpenDetail={(evt) => setDetailModalEvent(evt)}
          />
        ) : (
          <div className="p-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">নির্বাচিত ফিল্টারে এই মুহূর্তে কোনো সংবাদ নেই।</p>
            <button
              onClick={handleResetAllFilters}
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-stone-800 dark:hover:bg-emerald-700 cursor-pointer"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* জাতীয় পরিস্থিতি পর্যবেক্ষণ ও দৈনিক বুলেটিন বেন্টো */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-newspaper dark:shadow-2xl border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs sm:text-[13px] font-bold tracking-wide text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  সরাসরি জাতীয় ও আন্তর্জাতিক নিউজ পোর্টাল
                </span>
                <span className="font-serif text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  ২৪/৭ লাইভ
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 dark:text-stone-50 mt-3 leading-snug">
                {selectedScope === 'international' ? 'আন্তর্জাতিক ও বিশ্ব সংবাদ নেটওয়ার্ক' : 'সারাদেশ ও জাতীয় সংবাদ প্রবাহ'}
              </h3>
              <p className="font-serif text-sm sm:text-[15px] text-stone-700 dark:text-stone-200 mt-2.5 leading-relaxed font-normal">
                {selectedScope === 'international'
                  ? 'বিবিসি বাংলা, প্রথম আলো, বিডিনিউজ ২৪ এবং বাংলা ট্রিবিউন থেকে বিশ্বের সর্বশেষ আন্তর্জাতিক খবর লাইভ আপডেট হচ্ছে।'
                  : 'প্রথম আলো, বিডিনিউজ ২৪, দৈনিক ইত্তেফাক, বাংলা ট্রিবিউন, দেশ রূপান্তর ও চ্যানেল আই থেকে সর্বশেষ খবর সরাসরি একসাথে পড়ুন।'}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">সক্রিয় পোর্টাল:</span>
                  <span className="font-serif font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">৭+ শীর্ষ মিডিয়া</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">অটো-রিফ্রেশ:</span>
                  <span className="font-serif font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">১ মিনিটে সিঙ্ক</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  <span className="font-serif font-bold text-stone-700 dark:text-stone-300">প্রকাশ সময়:</span>
                  <span className="font-serif font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">আসল রুট সময়</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => { setSelectedScope('bangladesh'); setActiveFeedTab('bangladesh'); }}
                  className={"py-2 px-2 rounded-xl font-serif font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border " + (selectedScope === 'bangladesh'
                    ? 'bg-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>🇧🇩 সারাদেশ</span>
                </button>
                <button
                  onClick={() => { setSelectedScope('international'); setActiveFeedTab('international'); }}
                  className={"py-2 px-2 rounded-xl font-serif font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border " + (selectedScope === 'international'
                    ? 'bg-sky-700 text-white border-sky-600 shadow-md ring-2 ring-sky-500/30'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
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
                আজকের দিনের প্রধান প্রধান আলোচিত ঘটনা, অর্থনীতি ও আন্তর্জাতিক খবরের এক নজরে সংক্ষিপ্ত বুলেটিন পড়ুন ও সংরক্ষণ করুন।
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

        {/* সমন্বিত ফিল্টার বার */}
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
          todayLiveCount={selectedDateKey === todayKey ? newsEvents.length : 0}
        />

        {/* ইউটিলিটি ও ইনফরমেশন বেন্টো গ্রিড */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <WeatherPrayerWidget
            compact={true}
            divisionId="dhaka"
            districtBn="ঢাকা"
          />

          <TrendingBar
            selectedTag={selectedTrendingTag}
            onSelectTag={(tag) => setSelectedTrendingTag(tag)}
          />

          <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 text-white shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
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

        {/* দিন, মাস ও বছর ভিত্তিক সংবাদ আর্কাইভ বার */}
        <DateArchiveBar
          selectedDateKey={selectedDateKey}
          onSelectDateKey={(k) => changeDateKey(k)}
          totalEventsForDate={filteredEvents.length}
          todayLiveCount={selectedDateKey === todayKey ? newsEvents.length : 0}
        />

        {/* অতীত তারিখ নির্বাচনের নোটিশ ব্যানার */}
        {isViewingPastDate && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base block">
                  📅 আপনি বর্তমানে {selectedDateKey === 'all' ? 'সকল সংরক্ষিত আর্কাইভ' : `${formatBanglaDateLabel(selectedDateKey)} তারিখের সংরক্ষিত`} খবর দেখছেন
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  মোট {toBanglaNumber(filteredEvents.length)}টি প্রতিবেদন প্রদর্শিত হচ্ছে • লাইভ অটো-আপডেট সাময়িক স্থগিত রয়েছে
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

        {/* প্রধান নিউজ ফিড গ্রিড */}
        <section id="news-feed-grid" className="w-full scroll-mt-24 space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-5 rounded-full bg-emerald-600" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {selectedScope === 'international' || activeFeedTab === 'international'
                  ? '🌍 আন্তর্জাতিক ও বিশ্ব সংবাদ ফিড'
                  : selectedScope === 'bangladesh' || activeFeedTab === 'bangladesh'
                    ? '🇧🇩 সারাদেশের প্রধান সংবাদ ও প্রতিবেদন'
                    : 'সর্বশেষ জাতীয় ও আন্তর্জাতিক সংবাদ'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {toBanglaNumber(regularStories.length)}টি খবর
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <span className="hidden sm:inline font-medium">প্রতি স্ক্রিনে {toBanglaNumber(pageSize)}টি কার্ড (৩ কলাম)</span>
              <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                পৃষ্ঠা {toBanglaNumber(currentPage)} / {toBanglaNumber(totalPages)}
              </span>
            </div>
          </div>

          {isInitialLoading && newsEvents.length === 0 ? (
            <SkeletonCardGrid count={12} />
          ) : paginatedStories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
            <div className="p-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">
                নির্বাচিত ফিল্টারে কোনো খবর পাওয়া যায়নি
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                আপনার নির্বাচিত গণমাধ্যম, তারিখ বা ক্যাটাগরিতে এই মুহূর্তে কোনো সংবাদ নেই। ফিল্টার রিসেট করে সব খবর দেখতে পারেন।
              </p>
              <button
                onClick={handleResetAllFilters}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-stone-800 dark:hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                সকল ফিল্টার মুছুন
              </button>
            </div>
          )}
        </section>

        {/* বিশেষ ডাইজেস্ট ও পাঠক হাব (৩-কলাম বেন্টো) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {/* ১. আন্তর্জাতিক বিশ্ব ডাইজেস্ট */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-newspaper dark:shadow-xl space-y-3.5 transition-colors">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  আন্তর্জাতিক বিশ্ব ডাইজেস্ট
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedScope('international');
                  setActiveFeedTab('international');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
              >
                সব দেখুন →
              </button>
            </div>
            <div className="space-y-3">
              {internationalDigest.length > 0 ? internationalDigest.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDetailModalEvent(item)}
                  className="p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/50 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] text-sky-800 dark:text-sky-300 font-bold">
                    <span>{item.primarySource?.nameBn || 'বিশ্ব ডেস্ক'}</span>
                    <span className="font-mono text-stone-500 dark:text-stone-400">{getAccurateTimeAgo(item.published_at, item.time_ago)}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 leading-snug line-clamp-2">
                    {item.canonical_bangla_title}
                  </h4>
                </div>
              )) : (
                <p className="text-xs text-stone-500 dark:text-stone-400 py-4 text-center">সর্বশেষ আন্তর্জাতিক সংবাদ লোড হচ্ছে...</p>
              )}
            </div>
          </div>

          {/* ২. আলোচিত জাতীয় সংবাদ */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-newspaper dark:shadow-xl space-y-3.5 transition-colors">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  আলোচিত জাতীয় সংবাদ
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">সরাসরি</span>
            </div>
            <div className="space-y-3">
              {nationalDigest.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setDetailModalEvent(item)}
                  className="cursor-pointer group flex items-start gap-2.5 pb-2.5 border-b border-stone-100 dark:border-stone-800 last:border-b-0 last:pb-0"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {toBanglaNumber(idx + 1)}
                  </span>
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                      {item.canonical_bangla_title}
                    </h4>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">{item.primarySource?.nameBn || 'সারাদেশ'}</span>
                      <span>•</span>
                      <span>{getAccurateTimeAgo(item.published_at, item.time_ago)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ৩. আপনার সংরক্ষিত সংবাদ ও ৬০-সেকেন্ড শর্টস হাব */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white shadow-xl space-y-4 border border-emerald-500/20 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">সংরক্ষিত ও শর্টস</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-emerald-300">
                  {toBanglaNumber(bookmarkedEvents.length)}টি সংরক্ষিত
                </span>
              </div>

              <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                ৬০-সেকেন্ড নিউজ শর্টস ও অডিও বুলেটিন
              </h4>

              {bookmarkedEvents.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {bookmarkedEvents.slice(0, 2).map((bEvt) => (
                    <div
                      key={bEvt.id}
                      onClick={() => setDetailModalEvent(bEvt)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer text-xs text-stone-100 line-clamp-1 flex items-center gap-1.5 transition-colors"
                    >
                      <Newspaper className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{bEvt.canonical_bangla_title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-300 leading-relaxed">
                  যেকোনো সংবাদে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন, অথবা এক ক্লিকে আজকের সেরা খবরের ৬০-সেকেন্ড শর্টস দেখুন।
                </p>
              )}
            </div>

            <button
              onClick={() => setIsShortsOpen(true)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4" />
              <span>৬০-সেকেন্ড শর্টস চালু করুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </main>

      {/* ফুটার */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSelectChannel={(chId) => setActiveChannelId(chId)}
        onSelectScope={(scope) => {
          setSelectedScope(scope);
          setActiveFeedTab(scope === 'all' ? 'all_verified' : scope);
        }}
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* সমস্ত মডালসমূহ */}
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
          onClose={() => setIsBriefingModalOpen(false)}
        />
      )}

      {correctionEvent && (
        <CorrectionModal
          event={correctionEvent}
          onClose={() => setCorrectionEvent(null)}
        />
      )}

      <NewsRadioPlayer
        events={filteredEvents}
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        onOpenDetail={(evt) => setDetailModalEvent(evt)}
      />

      {isShortsOpen && (
        <NewsShortsModal
          isOpen={isShortsOpen}
          onClose={() => setIsShortsOpen(false)}
          events={filteredEvents}
          onOpenDetail={(evt) => setDetailModalEvent(evt)}
        />
      )}

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
