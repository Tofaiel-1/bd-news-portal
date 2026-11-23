import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Bookmark, 
  FileText, 
  ShieldCheck, 
  SlidersHorizontal, 
  Clock, 
  ChevronDown, 
  Sparkles, 
  Menu, 
  X, 
  Radio, 
  Flame, 
  Tv, 
  Sun, 
  Moon,
  Globe
} from 'lucide-react';
import FontSizeController from './FontSizeController';

// বাংলা সংখ্যা রূপান্তর
export const toBanglaNumber = (num) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[d]);
};

export default function Header({
  selectedScope = 'all',
  onSelectScope,
  onOpenSearchModal,
  onOpenVerificationLab,
  onOpenBriefingModal,
  onOpenLiveTvModal,
  onOpenRadio,
  onOpenShorts,
  activeFilterCount = 0,
  isDarkMode = false,
  onToggleDarkMode
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // লাইভ বাংলা ঘড়ি ও ক্যালেন্ডার আপডেট
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const dateStr = now.toLocaleDateString('bn-BD', options);
      const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentTime(`${dateStr} | ${timeStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
      {/* শীর্ষ ইউটিলিটি বার: লাইভ সময়, নীতিবাক্য ও ডায়াসপোরা ব্রিফিং */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-sans">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline text-stone-300 font-bold">লাইভ আপডেট:</span>
            <span className="text-white font-semibold text-xs sm:text-sm">{currentTime || 'বুধবার, ১৮ নভেম্বর ২০২৬'}</span>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-sans">
            <span className="hidden md:inline text-stone-300 font-medium">
              নির্ভরযোগ্য স্থানভিত্তিক সাংবাদিকতা ও বহু-উৎস প্রমাণ
            </span>
            <button
              onClick={onOpenBriefingModal}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>দৈনিক সংবাদ বুলেটিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* প্রধান ব্র্যান্ড ও অ্যাকশন হেডার */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* ব্র্যান্ড লোগো */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            {/* বাংলাদেশের পতাকার আদলে নান্দনিক মনোগ্রাম */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 rounded-full bg-red-600 shadow-inner"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-stone-900 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-stone-900" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  আমার বাংলাদেশ
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  যাচাইকৃত
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-semibold text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                সারাদেশ ও আন্তর্জাতিক সংবাদ নেটওয়ার্ক
              </p>
            </div>
          </a>
        </div>

        {/* মাঝের অংশ: সারাদেশ ও আন্তর্জাতিক কুইক সুইচ ট্যাব */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => onSelectScope('bangladesh')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedScope === 'bangladesh'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🇧🇩 সারাদেশ (বাংলাদেশ)</span>
          </button>

          <button
            onClick={() => onSelectScope('international')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedScope === 'international'
                ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>🌍 আন্তর্জাতিক (বিশ্ব)</span>
          </button>

          {selectedScope !== 'all' && (
            <button
              onClick={() => onSelectScope('all')}
              className="text-[11px] font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="সব খবর দেখুন"
            >
              সব খবর
            </button>
          )}
        </div>

        {/* ডানদিকের প্রধান অ্যাকশনসমূহ */}
        <div className="flex items-center gap-2">
          {/* ফন্ট সাইজ স্কেলার উইজেট */}
          <FontSizeController />

          {/* ডার্ক মোড / লাইট মোড টগল বাটন */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors border border-stone-200 dark:border-stone-700 flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            title={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          {/* ৬০-সেকেন্ড শর্টস বাটন */}
          {onOpenShorts && (
            <button
              onClick={onOpenShorts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 text-xs font-bold shadow-md shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="৬০-সেকেন্ড ফুলস্ক্রিন নিউজ শর্টস"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">শর্টস</span>
            </button>
          )}

          {/* লাইভ রেডিও বুলেটিন বাটন */}
          {onOpenRadio && (
            <button
              onClick={onOpenRadio}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-800 text-white hover:from-indigo-600 hover:to-violet-700 text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="সারাদিনের খবর একটানা শুনুন"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>রেডিও</span>
            </button>
          )}

          {/* লাইভ টিভি বাটন */}
          <button
            onClick={onOpenLiveTvModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="বাংলাদেশের শীর্ষ টিভি চ্যানেল সরাসরি দেখুন"
          >
            <Tv className="w-3.5 h-3.5 text-red-500" />
            <span>টিভি</span>
          </button>

          {/* সার্চ বাটন */}
          <button
            onClick={onOpenSearchModal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium transition-colors border border-stone-200 cursor-pointer"
            title="উপজেলা বা বিষয় অনুসন্ধান"
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">খুঁজুন</span>
          </button>

          {/* ভেরিফিকেশন টেস্ট ল্যাব বাটন (বিশেষ প্রম্পট ইঞ্জিন ফিচার) */}
          <button
            onClick={onOpenVerificationLab}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white hover:from-emerald-700 hover:to-teal-800 text-xs font-semibold shadow-sm transition-all ring-1 ring-emerald-600/40"
            title="বাংলাদেশ নিউজ ভেরিফিকেশন ইঞ্জিন টেস্ট ল্যাব"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ভেরিফিকেশন ল্যাব</span>
          </button>

          {/* মোবাইল মেনু টগল */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl md:hidden text-stone-700 hover:bg-stone-100"
            aria-label="মোবাইল মেনু"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রয়ার মেনু */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3 animate-fadeIn">
          <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onSelectScope('bangladesh');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedScope === 'bangladesh'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              🇧🇩 সারাদেশ (বাংলাদেশ)
            </button>
            <button
              onClick={() => {
                onSelectScope('international');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedScope === 'international'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              🌍 আন্তর্জাতিক (বিশ্ব)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveTvModal();
              }}
              className="p-2.5 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              লাইভ টিভি দেখুন
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearchModal();
              }}
              className="p-2.5 rounded-lg bg-stone-100 text-stone-800 font-medium flex items-center justify-center gap-1.5 border border-stone-200"
            >
              <Search className="w-4 h-4 text-stone-600" />
              অনুসন্ধান
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerificationLab();
              }}
              className="p-2.5 rounded-lg bg-stone-900 text-white font-medium flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              ভেরিফিকেশন ল্যাব
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBriefingModal();
              }}
              className="p-2.5 rounded-lg bg-stone-100 text-stone-800 font-medium flex items-center justify-center gap-1.5 border border-stone-200"
            >
              <FileText className="w-4 h-4 text-stone-600" />
              দৈনিক বুলেটিন
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
