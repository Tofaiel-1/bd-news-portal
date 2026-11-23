import React from 'react';
import { Tv, MessageCircle, Newspaper, Globe, Sparkles } from 'lucide-react';
import { NEWS_SOURCE_TYPES } from '../services/newsCrawlerService';

export default function SourceFilterBar({
  selectedSourceType,
  onSelectSourceType,
  sourceCounts = {}
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'youtube':
        return <Tv className="w-3.5 h-3.5 text-red-500" />;
      case 'facebook_verified':
        return <span className="text-blue-500 font-bold text-xs">f✓</span>;
      case 'national_press':
        return <Newspaper className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5">
      <span className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider mr-1 whitespace-nowrap">
        সংগ্রহের মাধ্যম:
      </span>
      {NEWS_SOURCE_TYPES.map(src => {
        const isSelected = selectedSourceType === src.id;
        const count = sourceCounts[src.id] || 0;

        return (
          <button
            key={src.id}
            onClick={() => onSelectSourceType(src.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
              isSelected
                ? `bg-gradient-to-r ${src.color} text-white shadow-md ring-2 ring-emerald-400/40`
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
            }`}
          >
            {getIcon(src.id)}
            <span>{src.labelBn}</span>
            {src.id !== 'all' && count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-800 border border-stone-200'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
