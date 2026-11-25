import React from 'react';
import { Flame, Hash } from 'lucide-react';

const TRENDING_TAGS = [
  { id: 'bd', label: '#বাংলাদেশ', query: 'বাংলাদেশ' },
  { id: 'court', label: '#আদালত_ও_আইন', query: 'আদালত' },
  { id: 'wage', label: '#পোশাক_মজুরি', query: 'মজুরি' },
  { id: 'cricket', label: '#ক্রিকেট', query: 'ক্রিকেট' },
  { id: 'football', label: '#ফুটবল', query: 'ফুটবল' },
  { id: 'economy', label: '#অর্থনীতি', query: 'অর্থনীতি' },
  { id: 'world', label: '#বিশ্ব_সংবাদ', query: 'ইসরায়েল' },
  { id: 'dhaka', label: '#ঢাকা', query: 'ঢাকা' }
];

export default function TrendingBar({ selectedTag, onSelectTag }) {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between gap-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold">
          <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
            <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </span>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              আলোচিত ট্রেন্ডিং টপিক
            </h4>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              এক ক্লিকে জনপ্রিয় বিষয়ের খবর ফিল্টার করুন
            </p>
          </div>
        </div>
        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            মুছুন
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TRENDING_TAGS.map((tag) => {
          const isSelected = selectedTag === tag.query;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(isSelected ? null : tag.query)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1 border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-500 shadow-md ring-2 ring-red-400/30'
                  : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Hash className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>{tag.label.replace('#', '')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
