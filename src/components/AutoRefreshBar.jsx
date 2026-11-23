import React from 'react';
import { 
  RotateCw, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { toBanglaNumber } from './Header';

export default function AutoRefreshBar({
  nextRefreshIn,
  isAutoRefreshActive,
  toggleAutoRefresh,
  isRefreshing,
  manualRefresh,
  lastUpdated,
  isAudioAlertEnabled,
  toggleAudioAlert
}) {
  const progressPercent = Math.max(0, Math.min(100, ((60 - nextRefreshIn) / 60) * 100));
  const timeFormatted = lastUpdated.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-indigo-950 text-white rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড অরা গ্লো ইফেক্ট */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* বাম পাশ: অটো-আপডেট স্ট্যাটাস ও টাইমার */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            {/* সার্কুলার প্রগ্রেস বার */}
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-stone-700/60"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={100}
                strokeDashoffset={100 - progressPercent}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  nextRefreshIn <= 10 ? 'text-amber-400' : 'text-emerald-400'
                }`}
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-white">
              {toBanglaNumber(nextRefreshIn)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>১ মিনিট অটো-সিঙ্ক</span>
              </span>
              <span className="text-xs text-stone-200 font-sans hidden sm:inline font-medium">
                {isAutoRefreshActive ? 'প্রতি ৬০ সেকেন্ডে টিভি চ্যানেল লাইভ ফেচ' : 'অটো-আপডেট স্থগিত'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-100 font-semibold mt-0.5">
              পরবর্তী অটো-আপডেট: <span className="text-emerald-300 font-bold">{toBanglaNumber(nextRefreshIn)} সেকেন্ড</span> পর
            </p>
          </div>
        </div>

        {/* মোবাইল ভিউতে লাস্ট আপডেটেড টাইম */}
        <span className="text-xs text-stone-300 font-mono block md:hidden">
          {timeFormatted}
        </span>
      </div>

      {/* ডান পাশ: ইন্টারেক্টিভ অ্যাকশন কন্ট্রোলস */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end z-10 flex-wrap">
        <div className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-stone-200 mr-2 font-mono bg-stone-800/80 px-2.5 py-1.5 rounded-xl border border-stone-700/60 font-semibold">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>আপডেট: {timeFormatted}</span>
        </div>

        {/* সাউন্ড অ্যালার্ট টগল */}
        <button
          onClick={toggleAudioAlert}
          className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
            isAudioAlertEnabled 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
              : 'bg-stone-800/80 text-stone-400 border-stone-700/60 hover:text-white'
          }`}
          title={isAudioAlertEnabled ? 'ব্রেকিং সাউন্ড অ্যালার্ট বন্ধ করুন' : 'ব্রেকিং সাউন্ড অ্যালার্ট চালু করুন'}
        >
          {isAudioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline text-xs">{isAudioAlertEnabled ? 'সাউন্ড অন' : 'মিউট'}</span>
        </button>

        {/* অটো-আপডেট পজ বা চালু */}
        <button
          onClick={toggleAutoRefresh}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isAutoRefreshActive 
              ? 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700' 
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
          }`}
        >
          {isAutoRefreshActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>পজ</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>চালু করুন</span>
            </>
          )}
        </button>

        {/* ম্যানুয়াল রিফ্রেশ বাটন */}
        <button
          onClick={manualRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'সংগ্রহ হচ্ছে...' : 'এখনই রিফ্রেশ'}</span>
        </button>
      </div>
    </div>
  );
}
