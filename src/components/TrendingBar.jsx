import React from 'react';
import { Flame, TrendingUp, Sparkles, Hash } from 'lucide-react';

const TRENDING_TAGS = [
  { id: 'breaking', label: '#ব্রেকিং', query: 'ব্রেকিং' },
  { id: 'traffic', label: '#যানজট_আপডেট', query: 'যানজট' },
  { id: 'weather', label: '#আবহাওয়া_সতর্কসংকেত', query: 'আবহাওয়া' },
  { id: 'market', label: '#বাজার_দর', query: 'বাজার' },
  { id: 'railway', label: '#রেলওয়ে_টিকিট', query: 'রেলওয়ে' },
  { id: 'agri', label: '#কৃষি_উন্নয়ন', query: 'কৃষি' },
  { id: 'tech', label: '#প্রযুক্তি', query: 'প্রযুক্তি' },
  { id: 'sports', label: '#ক্রিকেট', query: 'ক্রিকেট' }
];

export default function TrendingBar({ selectedTag, onSelectTag }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 px-1 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5 text-red-700 font-bold whitespace-nowrap mr-1.5 flex-shrink-0">
        <Flame className="w-4 h-4 text-red-600 animate-bounce" />
        <span className="text-xs sm:text-sm font-extrabold">ট্রেন্ডিং টপিক:</span>
      </div>

      <div className="flex items-center gap-2 flex-nowrap">
        {TRENDING_TAGS.map((tag) => {
          const isSelected = selectedTag === tag.query;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(isSelected ? null : tag.query)}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-400/40'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
              }`}
            >
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
