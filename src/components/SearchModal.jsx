import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Filter,
  ArrowRight,
  Radio,
  Clock
} from 'lucide-react';
import { CATEGORIES, VERIFICATION_STATUSES } from '../data/locations';
import { sanitizeText } from '../utils/security';
import { getAccurateTimeAgo, toBanglaNumber } from '../utils/dateUtils';

export default function SearchModal({
  events = [],
  onClose,
  onOpenDetail
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredEvents = useMemo(() => {
    const q = sanitizeText(searchTerm, 80).toLowerCase().trim();
    return events.filter(evt => {
      if (!evt) return false;
      const matchQuery = !q || (
        (evt.canonical_bangla_title && evt.canonical_bangla_title.toLowerCase().includes(q)) ||
        (evt.canonical_english_title && evt.canonical_english_title.toLowerCase().includes(q)) ||
        (evt.summary_bangla && evt.summary_bangla.toLowerCase().includes(q)) ||
        (evt.scopeLabel && evt.scopeLabel.toLowerCase().includes(q)) ||
        (evt.primarySource?.nameBn && evt.primarySource.nameBn.toLowerCase().includes(q)) ||
        (evt.location?.nameBn && evt.location.nameBn.toLowerCase().includes(q))
      );

      const evtCat = (evt.category || '').normalize('NFC');
      const selCat = (selectedCategory || 'all').normalize('NFC');
      const matchCategory = selCat === 'all' || evtCat === selCat;
      const matchStatus = selectedStatus === 'all' || evt.status === selectedStatus;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="bg-white dark:bg-stone-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* সার্চ বার */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="শিরোনাম, বিষয়, বাংলাদেশ, আন্তর্জাতিক বা পোর্টালের নাম খুঁজুন..."
            className="w-full text-sm sm:text-base focus:outline-none font-sans bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              মুছুন
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ফিল্টার বার */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-sans">
          <span className="text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> ফিল্টার:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.nameBn.normalize('NFC')}>{c.nameBn}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="all">সব ধরন</option>
            {Object.entries(VERIFICATION_STATUSES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.shortBn}</option>
            ))}
          </select>
        </div>

        {/* ফলাফল তালিকা */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[480px] space-y-2.5">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
            অনুসন্ধান ফলাফল ({toBanglaNumber(filteredEvents.length)}টি সংবাদ):
          </div>

          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 50).map(evt => (
              <div
                key={evt.id}
                onClick={() => {
                  onOpenDetail(evt);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded flex items-center gap-1">
                      {evt.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ'}
                    </span>
                    {evt.primarySource && (
                      <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {evt.primarySource.nameBn}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {getAccurateTimeAgo(evt.published_at, evt.time_ago)}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {evt.canonical_bangla_title}
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                  {evt.summary_bangla}
                </p>

                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>{evt.category}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    বিস্তারিত পড়ুন <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400">
              কোনো ফলাফল পাওয়া যায়নি। অন্যান্য শব্দ বা ফিল্টার পরিবর্তন করে খুঁজুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
