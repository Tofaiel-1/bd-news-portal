import React from 'react';
import { Radio, Tv, Flame, Play, Sparkles } from 'lucide-react';

export default function TvChannelsBar({
  channels = [],
  activeChannelId,
  onSelectChannel,
  onOpenLiveTvModal,
  eventsCountByChannel = {}
}) {
  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-2xl border border-stone-200/90 dark:border-stone-800 p-2.5 sm:p-3 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-600/10 text-rose-700 font-bold text-xs sm:text-sm flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>শীর্ষ টিভি চ্যানেল ফিড</span>
          </span>
          <span className="text-xs sm:text-sm text-stone-700 font-sans hidden sm:inline font-medium">
            সরাসরি সময়, যমুনা, চ্যানেল ২৪, ৭১ ও শীর্ষ গণমাধ্যমের সংবাদ
          </span>
        </div>

        {/* লাইভ টিভি দেখার স্পেশাল পপআপ বাটন */}
        <button
          onClick={onOpenLiveTvModal}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <Tv className="w-3.5 h-3.5" />
          <span>লাইভ টিভি দেখুন</span>
        </button>
      </div>

      {/* চ্যানেল পিলস স্ক্রলবার */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {channels.map((ch) => {
          const isActive = activeChannelId === ch.id;
          const count = eventsCountByChannel[ch.id] || 0;

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChannel(ch.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-white border-stone-950 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
              }`}
            >
              {ch.isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              <span>{ch.nameBn}</span>

              {ch.id !== 'all' && count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-900'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
