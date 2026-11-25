import React from 'react';
import { Newspaper } from 'lucide-react';

/**
 * যখন কোনো মূল সংবাদ পোর্টালের ছবি সাময়িকভাবে লোড না হয় বা অনুপস্থিত থাকে,
 * তখন বিভ্রান্তিকর বা পুনরাবৃত্ত ছবি না দেখিয়ে পোর্টালের ব্র্যান্ড ও বিষয়ভিত্তিক
 * নান্দনিক এডিটোরিয়াল কার্ড প্রদর্শন করে।
 */
export default function NewsImageFallback({
  sourceName = 'জাতীয় গণমাধ্যম',
  category = 'সংবাদ',
  color = '#059669',
  compact = false
}) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, #0f172a 0%, ${color}cc 55%, #064e3b 100%)`
      }}
    >
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <div className={`${compact ? 'w-8 h-8 rounded-xl' : 'w-11 h-11 rounded-2xl'} bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-md`}>
          <Newspaper className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>
        {!compact && (
          <div className="space-y-0.5">
            <div className="text-xs font-extrabold text-white drop-shadow-sm">
              {sourceName}
            </div>
            <div className="text-[10px] font-semibold text-white/80">
              {category}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
