import React from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/locations';
import { TOP_TV_CHANNELS } from '../services/newsFeedService';

export default function Footer({
  onSelectCategory,
  onSelectChannel,
  onSelectScope,
  onOpenBriefingModal,
  onOpenSearchModal
}) {
  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-300 border-t border-stone-800 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* ব্র্যান্ড কলাম */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">আমার বাংলাদেশ</span>
            </div>
            <p className="text-sm text-stone-200 leading-relaxed font-sans">
              সারাদেশ ও আন্তর্জাতিক সংবাদের জন্য দ্রুত, নির্ভরযোগ্য এবং সরাসরি মূল গণমাধ্যম ভিত্তিক নিউজ প্ল্যাটফর্ম।
            </p>
            <div className="pt-2 text-xs sm:text-sm text-emerald-400 font-bold">
              ✓ বস্তুনিষ্ঠ সাংবাদিকতা • ২৪/৭ লাইভ সংবাদ
            </div>
          </div>

          {/* সম্পাদকীয় মানদণ্ড */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              সংবাদ পরিবেশনার মানদণ্ড
            </h4>
            <ul className="text-xs sm:text-sm text-stone-300 space-y-2.5">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>প্রতিটি খবরের সাথে মূল জাতীয় গণমাধ্যমের আসল প্রকাশিত ছবি সংযুক্ত থাকে।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>মূল পোর্টালের প্রকাশের প্রকৃত সময় অনুসারে নির্ভুল সময় প্রদর্শিত হয়।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>প্রতিটি প্রতিবেদনের সাথে সরাসরি মূল পোর্টালে পড়ার লিংক যুক্ত রয়েছে।</span>
              </li>
            </ul>
          </div>

          {/* প্রধান বিষয়সমূহ */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              প্রধান সংবাদ বিষয়সমূহ
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm text-stone-300">
              {CATEGORIES.filter(c => c.id !== 'all').slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.nameBn.normalize('NFC'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-emerald-400 py-1 font-medium transition-colors cursor-pointer"
                >
                  {cat.nameBn}
                </button>
              ))}
            </div>
          </div>

          {/* দ্রুত বিভাগসমূহ */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              দ্রুত নেভিগেশন
            </h4>
            <ul className="text-xs sm:text-sm text-stone-300 space-y-2 font-medium">
              <li>
                <button
                  onClick={() => {
                    if (onSelectScope) onSelectScope('bangladesh');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🇧🇩 সারাদেশের তাজা খবর
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectScope) onSelectScope('international');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🌍 আন্তর্জাতিক ও বিশ্ব সংবাদ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBriefingModal && onOpenBriefingModal()}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  📰 আজকের সংবাদ বুলেটিন (PDF)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSearchModal && onOpenSearchModal()}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🔍 বিষয়ভিত্তিক সংবাদ অনুসন্ধান
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* সংযুক্ত গণমাধ্যম স্ট্রিপ */}
        <div className="py-6 border-b border-stone-800 text-xs sm:text-sm">
          <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider block mb-3">
            সংযুক্ত প্রধান জাতীয় ও আন্তর্জাতিক গণমাধ্যমসমূহ:
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-stone-300 text-xs sm:text-sm font-medium">
            {TOP_TV_CHANNELS.filter(c => c.id !== 'all').map((ch, idx, arr) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (onSelectChannel) onSelectChannel(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-emerald-400 transition-colors py-0.5 flex items-center gap-1 cursor-pointer"
              >
                <span>{ch.nameBn}</span>
                {idx < arr.length - 1 && <span className="text-stone-600 ml-2">•</span>}
              </button>
            ))}
          </div>
        </div>

        {/* কপিরাইট */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300 font-medium">
          <p>© ২০২৬ আমার বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত। বস্তুনিষ্ঠ ও নির্ভরযোগ্য সাংবাদিকতার অঙ্গীকার।</p>
          <p className="flex items-center gap-1.5">
            <span>নির্মিত হয়েছে সত্য ও নির্ভরযোগ্য সংবাদ পাঠকদের জন্য</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
