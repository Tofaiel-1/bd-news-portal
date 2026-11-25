import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Share2, 
  Tv, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Radio,
  Flame
} from 'lucide-react';
import { speakBangla, stopSpeech } from '../utils/speechUtils';
import { toBanglaNumber, getAccurateTimeAgo } from '../utils/dateUtils';

export default function NewsShortsModal({
  isOpen,
  onClose,
  events = [],
  onOpenDetail
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [imgError, setImgError] = useState(false);

  const playlist = events.slice(0, 20); // শীর্ষ ২০টি সংবাদ
  const currentEvent = playlist[currentIndex] || playlist[0];

  useEffect(() => {
    setImgError(false);
    stopSpeech();
    setIsPlayingAudio(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  if (!isOpen || !currentEvent) return null;

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // লুপ
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(playlist.length - 1);
    }
  };

  const toggleSpeech = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const text = `${currentEvent.canonical_bangla_title}। ${currentEvent.summary_bangla}`;
      speakBangla(
        text,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 animate-fadeIn">
      {/* মূল শর্টস কার্ড কন্টেইনার (মোবাইল এস্পেক্ট রেশিও) */}
      <div className="relative w-full max-w-md h-[92vh] max-h-[780px] bg-stone-950 rounded-[32px] overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between">
        
        {/* টপ ফ্লোটিং হেডার */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3.5 h-3.5" />
              <span>৬০-সেকেন্ড শর্টস</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-mono backdrop-blur-md">
              {toBanglaNumber(currentIndex + 1)}/{toBanglaNumber(playlist.length)}
            </span>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ব্যাকগ্রাউন্ড ফুল ইমেজ বা গ্রেডিয়েন্ট */}
        <div className="absolute inset-0 z-0">
          {!imgError && currentEvent.image_url ? (
            <img
              src={currentEvent.image_url}
              alt={currentEvent.canonical_bangla_title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
              <span className="text-white font-serif font-bold text-lg">
                {currentEvent.scope === 'international' ? 'আন্তর্জাতিক বিশ্ব বুলেটিন' : 'সারাদেশের বিশেষ বুলেটিন'}
              </span>
            </div>
          )}
          {/* গ্রেডিয়েন্ট ওভারলে যেন নিচের লেখা স্পষ্ট পড়া যায় */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-black/30 pointer-events-none" />
        </div>

        {/* ডানদিকের কুইক অ্যাকশন বাটনসমূহ (ইনস্টাগ্রাম/টিকটক স্টাইল) */}
        <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-3">
          {/* ভয়েস রিডার */}
          <button
            onClick={toggleSpeech}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-xl transition-all cursor-pointer ${
              isPlayingAudio ? 'bg-emerald-600 scale-110 ring-4 ring-emerald-400/40' : 'bg-black/50 hover:bg-black/80'
            }`}
            title={isPlayingAudio ? 'থামান' : 'শুনুন'}
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* বিস্তারিত দেখুন */}
          <button
            onClick={() => onOpenDetail(currentEvent)}
            className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transition-all cursor-pointer"
            title="বিস্তারিত পড়ুন"
          >
            <ExternalLink className="w-5 h-5" />
          </button>

          {/* নেভিগেশন বাটন (Up / Down) */}
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            title="পূর্ববর্তী"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            title="পরবর্তী"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* বটম কন্টেন্ট: শিরোনাম ও মূল পয়েন্টসমূহ */}
        <div className="relative z-10 p-5 pt-0 space-y-3 mt-auto">
          {/* ব্যাজসমূহ */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
              <span>{currentEvent.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ (বাংলাদেশ)'}</span>
            </span>

            {currentEvent.primarySource && (
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1"
                style={{ backgroundColor: currentEvent.primarySource.color || '#E11D48' }}
              >
                <Radio className="w-3 h-3" />
                <span>{currentEvent.primarySource.nameBn}</span>
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/25 text-white backdrop-blur-md">
              {getAccurateTimeAgo(currentEvent.published_at, currentEvent.time_ago)}
            </span>
          </div>

          {/* মূল শিরোনাম */}
          <h3 className="font-serif text-lg sm:text-2xl font-black text-white leading-snug drop-shadow-md">
            {currentEvent.canonical_bangla_title}
          </h3>

          {/* ৬০ শব্দের সারসংক্ষেপ */}
          <p className="text-sm sm:text-base text-stone-100 font-medium leading-relaxed font-sans line-clamp-4 bg-black/50 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
            {currentEvent.summary_bangla}
          </p>

          {/* নিচে পরবর্তী সংবাদে যাওয়ার ইঙ্গিত */}
          <div 
            onClick={handleNext}
            className="pt-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-400 cursor-pointer hover:text-emerald-300"
          >
            <span>পরবর্তী খবরের জন্য সোয়াইপ বা ক্লিক করুন</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

      </div>
    </div>
  );
}
