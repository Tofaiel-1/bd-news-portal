import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  AlertOctagon, 
  Flame, 
  Calendar, 
  Filter, 
  X, 
  Globe, 
  Tv, 
  Layers, 
  ChevronDown,
  Sparkles,
  Radio
} from 'lucide-react';
import { CATEGORIES } from '../data/locations';
import { getPastDaysList, formatDateKey } from '../services/districtNewsCoverageService';
import { TOP_TV_CHANNELS } from '../services/newsFeedService';

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = (n) => String(n ?? 0).replace(/[0-9]/g, d => bnDigits[d]);

const CATEGORY_EMOJIS = {
  all: '🌐',
  national_politics: '🏛️',
  international: '🌍',
  business_economy: '📈',
  sports: '⚽',
  entertainment: '🎬',
  technology: '💻',
  education_jobs: '🎓',
  law_court: '⚖️',
  agriculture_nature: '🌾',
  health_medicine: '🩺',
  transport_traffic: '🚌',
  weather_climate: '⛈️',
  diaspora: '✈️',
  lifestyle_religion: '🕌'
};

export default function UnifiedFilterBar({
  activeFeedTab,
  onSelectFeedTab,
  selectedScope = 'all',
  onSelectScope,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  selectedDateKey,
  onSelectDateKey,
  selectedSourceType,
  onSelectSourceType,
  activeChannelId,
  onSelectChannel,
  onResetAllFilters,
  activeFilterCount = 0
}) {
  const daysList = getPastDaysList(7);
  const todayKey = formatDateKey(new Date());

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-2 sm:p-3 shadow-sm space-y-2.5 transition-all">
      {/* ১ম লাইন: মূল ফিড সুইচ ট্যাব (সারাদেশ ও আন্তর্জাতিক ফোকাসড) */}
      <div className="flex items-center justify-between gap-3">
        {/* প্রধান ৫টি ফিড ট্যাব */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all_verified', labelBn: 'সকল খবর', icon: ShieldCheck },
            { id: 'bangladesh', labelBn: 'সারাদেশ', icon: MapPin },
            { id: 'international', labelBn: 'আন্তর্জাতিক', icon: Globe },
            { id: 'breaking', labelBn: 'ব্রেকিং', icon: Flame, badge: 'লাইভ' },
            { id: 'disputed', labelBn: 'ফ্যাক্ট-চেক', icon: AlertOctagon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeedTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectFeedTab(tab.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{tab.labelBn}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ২য় লাইন: স্লিম স্মার্ট ড্রপডাউন ফিল্টারসমূহ (পরিধি, বিষয়, মাধ্যম, চ্যানেল ও তারিখ) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 border-t border-stone-100 dark:border-stone-800 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-bold hidden md:inline whitespace-nowrap mr-1">
          ফিল্টার করুন:
        </span>

        {/* পরিধি ড্রপডাউন (সারাদেশ / আন্তর্জাতিক) */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedScope}
            onChange={(e) => onSelectScope(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-colors ${
              selectedScope !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
            }`}
          >
            <option value="all">🌐 সকল পরিধি (সারাদেশ ও বিশ্ব)</option>
            <option value="bangladesh">🇧🇩 সারাদেশ (বাংলাদেশ)</option>
            <option value="international">🌍 আন্তর্জাতিক (বিশ্ব সংবাদ)</option>
          </select>
        </div>

        {/* ক্যাটাগরি ড্রপডাউন (১৪টি বিষয় ও লাইভ সংখ্যা ব্যাজ) */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-colors ${
              selectedCategory !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
            }`}
          >
            <option value="all">📂 সকল ক্যাটাগরি ({toBn(categoryCounts.all || 0)})</option>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const count = categoryCounts[cat.nameBn] || 0;
              const emoji = CATEGORY_EMOJIS[cat.id] || '📁';
              return (
                <option key={cat.id} value={cat.nameBn}>
                  {emoji} {cat.nameBn} {count > 0 ? `(${toBn(count)})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* মাধ্যম ও সোর্স ড্রপডাউন */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedSourceType}
            onChange={(e) => onSelectSourceType(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-colors ${
              selectedSourceType !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
            }`}
          >
            <option value="all">🌐 সকল মাধ্যম</option>
            <option value="national_press">📰 জাতীয় প্রেস ও অনলাইন</option>
            <option value="youtube">📺 টিভি ও ভিডিও রিপোর্ট</option>
            <option value="facebook_verified">f✓ ভেরিফাইড ব্যুরো পেজ</option>
          </select>
        </div>

        {/* নির্দিষ্ট গণমাধ্যম পোর্টাল নির্বাচন ড্রপডাউন */}
        <div className="relative flex-shrink-0">
          <select
            value={activeChannelId}
            onChange={(e) => onSelectChannel(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-colors ${
              activeChannelId !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
            }`}
          >
            <option value="all">📰 সকল গণমাধ্যম পোর্টাল</option>
            {TOP_TV_CHANNELS.filter(c => c.id !== 'all').map(ch => (
              <option key={ch.id} value={ch.id}>
                {ch.logoText || '📰'} {ch.nameBn}
              </option>
            ))}
          </select>
        </div>

        {/* দিনভিত্তিক তারিখ ড্রপডাউন */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedDateKey}
            onChange={(e) => onSelectDateKey(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-colors ${
              selectedDateKey !== todayKey
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-300 font-extrabold'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
            }`}
          >
            {daysList.map(d => (
              <option key={d.dateKey} value={d.dateKey}>
                📅 {d.shortLabel}
              </option>
            ))}
          </select>
        </div>

        {/* ফিল্টার রিসেট বাটন */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetAllFilters}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
            title="সকল ফিল্টার মুছুন"
          >
            <X className="w-3.5 h-3.5" />
            <span>রিসেট ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* ৩য় লাইন: সকল ক্যাটাগরি এক ক্লিকে দেখার দ্রুত স্ক্রলিং পিলস বার */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
        {CATEGORIES.map(cat => {
          const isCatActive = (cat.id === 'all' && selectedCategory === 'all') || (selectedCategory === cat.nameBn);
          const count = cat.id === 'all' ? (categoryCounts.all || 0) : (categoryCounts[cat.nameBn] || 0);
          const emoji = CATEGORY_EMOJIS[cat.id] || '📁';

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.nameBn)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isCatActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-400/30'
                  : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span>{cat.nameBn}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isCatActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}>
                  {toBn(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
