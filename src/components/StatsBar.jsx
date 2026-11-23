import React from 'react';
import { 
  Flame, 
  MapPin, 
  Tv, 
  Radio, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Layers,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { toBanglaNumber } from './Header';

export const DIVISION_GRADIENTS = {
  dhaka: 'from-emerald-500 via-teal-600 to-emerald-700',
  chattogram: 'from-blue-600 via-cyan-600 to-indigo-700',
  rajshahi: 'from-amber-500 via-orange-500 to-amber-700',
  khulna: 'from-teal-600 via-emerald-700 to-green-800',
  barishal: 'from-sky-500 via-blue-600 to-indigo-800',
  sylhet: 'from-emerald-600 via-green-700 to-teal-800',
  rangpur: 'from-rose-500 via-orange-500 to-red-600',
  mymensingh: 'from-purple-600 via-indigo-600 to-violet-800'
};

export default function StatsBar({
  totalCount = 64,
  breakingCount = 12,
  coveredDistrictsCount = 64,
  activeChannelsCount = 8,
  nextRefreshIn = 60,
  isAutoRefreshActive = true,
  onManualRefresh,
  isRefreshing = false,
  isAudioAlertEnabled = true,
  onToggleAudio,
  selectedDivisionId = 'all',
  onSelectDivision
}) {
  const divisions = [
    { id: 'all', nameBn: 'সারাদেশ (৬৪ জেলা)', color: 'from-stone-900 to-stone-700' },
    { id: 'dhaka', nameBn: 'ঢাকা (১৩)', color: 'from-emerald-600 to-teal-700' },
    { id: 'chattogram', nameBn: 'চট্টগ্রাম (১১)', color: 'from-blue-600 to-cyan-700' },
    { id: 'rajshahi', nameBn: 'রাজশাহী (৮)', color: 'from-amber-600 to-orange-700' },
    { id: 'khulna', nameBn: 'খুলনা (১০)', color: 'from-teal-600 to-emerald-800' },
    { id: 'barishal', nameBn: 'বরিশাল (৬)', color: 'from-sky-600 to-blue-700' },
    { id: 'sylhet', nameBn: 'সিলেট (৪)', color: 'from-green-600 to-emerald-800' },
    { id: 'rangpur', nameBn: 'রংপুর (৮)', color: 'from-rose-600 to-red-700' },
    { id: 'mymensingh', nameBn: 'ময়মনসিংহ (৪)', color: 'from-purple-600 to-indigo-700' }
  ];

  return (
    <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-stone-200/90 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* টপ লেভেল: লাইভ স্ট্যাটাস মেট্রিক্স পিলসমূহ */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm">
          {/* মেট্রিক্স গ্রুপ */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* ব্রেকিং লাইভ ব্যাজ */}
            <div className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 flex items-center gap-2 font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 live-indicator" />
              <Flame className="w-4 h-4 text-rose-600" />
              <span>ব্রেকিং: <span className="font-mono">{toBanglaNumber(breakingCount)}</span>টি</span>
            </div>

            {/* ৬৪ জেলা কভারেজ মিটার */}
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-2 font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>জেলা কভারেজ: <span className="font-mono">{toBanglaNumber(coveredDistrictsCount)}/৬৪</span></span>
            </div>

            {/* মোট আজকের তাজা খবর */}
            <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-300 flex items-center gap-2 font-bold shadow-sm hidden md:flex">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>আজকের তাজা সংবাদ: <span className="font-mono">{toBanglaNumber(totalCount)}</span>টি</span>
            </div>

            {/* লাইভ টিভি হাব */}
            <div className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-300 flex items-center gap-2 font-bold shadow-sm hidden lg:flex">
              <Tv className="w-4 h-4 text-red-600" />
              <span>লাইভ টিভি: <span className="font-mono">{toBanglaNumber(activeChannelsCount)}</span>টি স্টেশন</span>
            </div>
          </div>

          {/* কন্ট্রোল গ্রুপ (রিফ্রেশ কাউন্টডাউন ও অডিও টগল) */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {/* পরবর্তী রিফ্রেশ কাউন্টডাউন */}
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="এখনই নতুন খবর খুঁজুন"
              className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="font-mono">{toBanglaNumber(nextRefreshIn)}s</span>
              <span className="hidden sm:inline">পর লাইভ রিফ্রেশ</span>
            </button>

            {/* অডিও অ্যালার্ট টগল */}
            <button
              onClick={onToggleAudio}
              title={isAudioAlertEnabled ? 'শব্দ সতর্কতা চালু আছে (বন্ধ করতে ক্লিক করুন)' : 'শব্দ সতর্কতা বন্ধ আছে (চালু করতে ক্লিক করুন)'}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                isAudioAlertEnabled 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-stone-100 border-stone-300 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {isAudioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* নিচের সারি: ৮ বিভাগের দ্রুত কালারফুল ফিল্টার চিপস */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {divisions.map((div) => {
            const isSelected = selectedDivisionId === div.id;
            return (
              <button
                key={div.id}
                onClick={() => onSelectDivision(div.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? `bg-gradient-to-r ${div.color} text-white border-transparent shadow-md scale-105`
                    : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border-stone-300 hover:border-stone-400'
                }`}
              >
                <span>{div.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
