import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { speakBangla, stopSpeech } from '../utils/speechUtils';
import { toBanglaNumber } from './Header';

export default function NewsRadioPlayer({
  events = [],
  isOpen = false,
  onClose,
  onOpenDetail
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const playlist = events.slice(0, 15); // শীর্ষ ১৫টি সংবাদ
  const currentEvent = playlist[currentIndex] || playlist[0];

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const playCurrentEvent = (idx) => {
    const target = playlist[idx];
    if (!target) return;

    stopSpeech();
    const scopePrefix = target.scope === 'international' ? 'আন্তর্জাতিক বিশ্ব সংবাদ' : 'সারাদেশের জাতীয় সংবাদ';
    const textToSpeak = `${scopePrefix}। ${target.canonical_bangla_title}। ${target.summary_bangla}`;
    
    speakBangla(
      textToSpeak,
      () => setIsPlaying(true),
      () => {
        // পরবর্তী সংবাদে স্বয়ংক্রিয়ভাবে যাওয়া
        if (idx < playlist.length - 1) {
          setCurrentIndex(idx + 1);
          playCurrentEvent(idx + 1);
        } else {
          setIsPlaying(false);
        }
      }
    );
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      playCurrentEvent(currentIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (isPlaying) playCurrentEvent(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (isPlaying) playCurrentEvent(prevIdx);
    }
  };

  if (!isOpen || !currentEvent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[450px] z-50 animate-fadeIn">
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-indigo-950 text-white rounded-3xl p-4 shadow-2xl border border-white/20 backdrop-blur-xl space-y-3">
        {/* টপ বার: রেডিও পরিচিতি ও মিনিমাইজ/ক্লোজ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  লাইভ এআই রেডিও বুলেটিন
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                আজকের শীর্ষ খবর শুনুন • {toBanglaNumber(currentIndex + 1)}/{toBanglaNumber(playlist.length)}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(prev => !prev)}
              className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="ছোট/বড় করুন"
            >
              <ChevronUp className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* সংবাদ শিরোনাম ও এলাকা */}
            <div 
              onClick={() => onOpenDetail(currentEvent)}
              className="cursor-pointer group p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>{currentEvent.scope === 'international' ? '🌍 আন্তর্জাতিক বিশ্ব সংবাদ' : '🇧🇩 সারাদেশ (বাংলাদেশ)'}</span>
                <span className="text-stone-300 font-semibold">{currentEvent.category}</span>
              </div>
              <h5 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                {currentEvent.canonical_bangla_title}
              </h5>
            </div>

            {/* সাউন্ড ওয়েভ ও প্রোগ্রেস বার */}
            <div className="space-y-1.5">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / playlist.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-300 font-mono font-bold">
                <span>শুরু</span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 text-emerald-400 animate-pulse">
                    <span className="inline-block w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="inline-block w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="inline-block w-1 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>বাংলা পাঠ চলছে...</span>
                  </span>
                )}
                <span>শেষ</span>
              </div>
            </div>

            {/* প্লেয়ার কন্ট্রোলসমূহ */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
                title="পূর্ববর্তী খবর"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-500/20"
                title={isPlaying ? 'বিরতি' : 'চালান'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === playlist.length - 1}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
                title="পরবর্তী খবর"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
