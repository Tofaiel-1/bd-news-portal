import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  MapPin,
  Filter,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CATEGORIES, VERIFICATION_STATUSES } from '../data/locations';
import { sanitizeText } from '../utils/security';

export default function SearchModal({
  events = [],
  onClose,
  onOpenDetail
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // কীওয়ার্ড সার্চ (স্যানিটাইজড ও নিরাপদ)
      const q = sanitizeText(searchTerm, 80).toLowerCase().trim();
      const matchQuery = !q || (
        evt.canonical_bangla_title.toLowerCase().includes(q) ||
        (evt.canonical_english_title && evt.canonical_english_title.toLowerCase().includes(q)) ||
        evt.summary_bangla.toLowerCase().includes(q) ||
        (evt.scopeLabel && evt.scopeLabel.toLowerCase().includes(q)) ||
        (evt.location?.nameBn && evt.location.nameBn.toLowerCase().includes(q)) ||
        evt.independence.independent_sources.some(s => s.name.toLowerCase().includes(q))
      );

      // ক্যাটাগরি ফিল্টার
      const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory;

      // স্ট্যাটাস ফিল্টার
      const matchStatus = selectedStatus === 'all' || evt.status === selectedStatus;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* সার্চ বার */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="বিষয়, সারসংক্ষেপ, বাংলাদেশ বা আন্তর্জাতিক সংবাদ খুঁজুন (যেমন: ঢাকা, অর্থনীতি, মধ্যপ্রাচ্য, বিবিসি)..."
            className="w-full text-sm sm:text-base focus:outline-none font-sans text-stone-900 placeholder:text-stone-400"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              মুছুন
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ফিল্টার বার */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs font-sans">
          <span className="text-stone-500 font-semibold flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> ফিল্টার:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.nameBn}>{c.nameBn}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">সব ভেরিফিকেশন স্ট্যাটাস</option>
            {Object.entries(VERIFICATION_STATUSES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.shortBn}</option>
            ))}
          </select>
        </div>

        {/* ফলাফল তালিকা */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[460px] space-y-2.5">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
            অনুসন্ধান ফলাফল ({filteredEvents.length}টি ঘটনা):
          </div>

          {filteredEvents.length > 0 ? (
            filteredEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => {
                  onOpenDetail(evt);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    {evt.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ (বাংলাদেশ)'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">{evt.time_ago}</span>
                    <span className="font-bold text-emerald-700 font-mono">{evt.confidence}% আস্থা</span>
                  </div>
                </div>

                <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {evt.canonical_bangla_title}
                </h4>

                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {evt.summary_bangla}
                </p>

                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{evt.category} • {evt.independence.independent_source_count}টি স্বাধীন উৎস</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    বিস্তারিত রিপোর্ট <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-stone-500">
              কোনো ফলাফল পাওয়া যায়নি। অন্যান্য শব্দ বা ফিল্টার পরিবর্তন করে খুঁজুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
