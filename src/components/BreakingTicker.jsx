import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ChevronRight, 
  Pause, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';
import { toBanglaNumber } from './Header';

export default function BreakingTicker({ 
  items = [], 
  onSelectEvent,
  nextRefreshIn = 60,
  onManualRefresh,
  isRefreshing = false,
  isAudioAlertEnabled = true,
  onToggleAudio
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!items || items.length === 0) return null;
  const currentItem = items[currentIndex];

  const getTagBadge = (type, tag) => {
    if (type === 'conflict') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-600 text-white uppercase tracking-wider shadow-sm flex-shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          {tag}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-600 text-white uppercase tracking-wider shadow-sm flex-shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {tag}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-r from-red-950 via-stone-950 to-indigo-950 text-white border-b border-red-900/40 py-2 px-4 sm:px-6 relative overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* ব্রেকিং ইন্ডিকেটর লেবেল */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300 font-sans text-xs sm:text-sm flex items-center gap-1.5 drop-shadow-sm whitespace-nowrap">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            লাইভ ব্রেকিং
          </span>
          <span className="text-stone-700 hidden sm:inline">|</span>
        </div>

        {/* স্লাইডিং নিউজ হেডলাইন */}
        <div
          className="flex-1 overflow-hidden cursor-pointer group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => currentItem && onSelectEvent(currentItem.eventId)}
        >
          <div className="flex items-center gap-2.5 transition-all duration-300">
            {getTagBadge(currentItem.type, currentItem.tagBn)}
            <p className="font-serif text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate drop-shadow-sm">
              {currentItem.textBn}
            </p>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform flex-shrink-0 hidden sm:block" />
          </div>
        </div>

        {/* ডানদিকের স্লিম অটো-রিফ্রেশ ও অডিও কন্ট্রোল (কোনো ডুপ্লিকেট বার লাগবে না) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* অটো-রিফ্রেশ কাউন্টডাউন পিল */}
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
              title="এখনই নতুন খবর রিফ্রেশ করুন"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span className="font-mono text-emerald-300">{toBanglaNumber(nextRefreshIn)}s</span>
              <span className="hidden lg:inline text-stone-300 font-normal">সিঙ্ক</span>
            </button>
          )}

          {/* সাউন্ড অ্যালার্ট টগল */}
          {onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                isAudioAlertEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-stone-500 hover:text-stone-400'
              }`}
              title={isAudioAlertEnabled ? 'শব্দ সতর্কতা চালু' : 'শব্দ সতর্কতা বন্ধ'}
            >
              {isAudioAlertEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* প্লে/পজ */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 text-stone-400 hover:text-white rounded transition-colors cursor-pointer hidden sm:block"
            title={isPaused ? 'চালান' : 'থামান'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
