import React from 'react';
import { ShieldCheck, Heart, Globe, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/locations';
import { TOP_TV_CHANNELS } from '../services/newsFeedService';

export default function Footer({ onSelectCategory, onSelectChannel }) {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 font-sans">
      {/* প্রধান ভ্যালু প্রপোজিশন ও ফ্যাক্ট-চেক মূলনীতি */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* ব্র্যান্ড কলাম */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600"></div>
              </div>
              <span className="font-serif text-2xl font-bold text-white">আমার বাংলাদেশ</span>
            </div>
            <p className="text-sm text-stone-200 leading-relaxed font-sans">
              সারাদেশ ও আন্তর্জাতিক সংবাদ পাঠকবৃন্দের জন্য শতভাগ নির্ভরযোগ্য, বহু-উৎস সমর্থিত ও সত্যতা নিশ্চিতকরণ নিউজ প্ল্যাটফর্ম।
            </p>
            <div className="pt-2 text-xs sm:text-sm text-emerald-400 font-bold">
              ✓ নো-ক্লিকবেইট • মাল্টি-সোর্স এভিডেন্স বেসড
            </div>
          </div>

          {/* ভেরিফিকেশন নীতি */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              যাচাইকরণের ৩টি কঠোর নীতি
            </h4>
            <ul className="text-xs sm:text-sm text-stone-300 space-y-2.5">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>সংবাদের সংখ্যাকে সত্যতা নয়, বরং স্বাধীন সূত্রের প্রমাণকে প্রাধান্য দেওয়া হয়।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>একই মালিকানাভুক্ত বা সিন্ডিকেট কপি কখনোই পৃথক স্বাধীন উৎস হিসেবে গণনা হয় না।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>প্রত্যেকটি দাবির সাথে মূল প্রতিবেদনের সরাসরি উদ্ধৃতি সংরক্ষিত থাকে।</span>
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
                    if (onSelectCategory) onSelectCategory(cat.nameBn);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-emerald-400 py-1 font-medium transition-colors"
                >
                  {cat.nameBn}
                </button>
              ))}
            </div>
          </div>

          {/* পলিসি ও সংযোগ */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              তথ্য ও স্বচ্ছতা
            </h4>
            <ul className="text-xs sm:text-sm text-stone-300 space-y-2 font-medium">
              <li><a href="#" className="hover:text-emerald-400">সম্পাদকীয় আচরণবিধি ও ফ্যাক্ট-চেক ফ্রেমওয়ার্ক</a></li>
              <li><a href="#" className="hover:text-emerald-400">পাবলিক সোর্স অনবোর্ডিং নির্দেশিকা</a></li>
              <li><a href="#" className="hover:text-emerald-400">সংশোধন ও খণ্ডন প্রকাশনা নীতি</a></li>
              <li><a href="#" className="hover:text-emerald-400">ওপেন ডেটা ও এপিআই অ্যাক্সেস</a></li>
            </ul>
          </div>
        </div>

        {/* সংযুক্ত প্রধান গণমাধ্যম ও টিভি নেটওয়ার্ক স্ট্রিপ */}
        <div className="py-6 border-b border-stone-800 text-xs sm:text-sm">
          <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider block mb-3">
            সংযুক্ত প্রধান গণমাধ্যম ও টিভি নেটওয়ার্ক:
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-stone-300 text-xs sm:text-sm font-medium">
            {TOP_TV_CHANNELS.filter(c => c.id !== 'all').map((ch, idx, arr) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (onSelectChannel) onSelectChannel(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-emerald-400 transition-colors py-0.5 flex items-center gap-1"
              >
                <span>{ch.nameBn}</span>
                {idx < arr.length - 1 && <span className="text-stone-600 ml-2">•</span>}
              </button>
            ))}
          </div>
        </div>

        {/* কপিরাইট ও ফুটনোট */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300 font-medium">
          <p>© ২০২৬ আমার বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত। বস্তুনিষ্ঠ ও নির্ভরযোগ্য সাংবাদিকতার অঙ্গীকার।</p>
          <p className="flex items-center gap-1.5">
            <span>নির্মিত হয়েছে সত্য ও বস্তুনিষ্ঠ সংবাদ পাঠকদের আস্থার জন্য</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
