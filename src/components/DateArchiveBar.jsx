import React, { useState, useMemo } from 'react';
import { Calendar, History, RotateCcw, Search, ChevronDown, Filter, Sparkles } from 'lucide-react';
import {
  getPastDaysList,
  formatDateKey,
  formatBanglaDateLabel,
  getAvailableArchiveSummary,
  BANGLA_MONTHS,
  toBanglaDigit
} from '../services/districtNewsCoverageService';

export default function DateArchiveBar({
  selectedDateKey,
  onSelectDateKey,
  totalEventsForDate = 0
}) {
  const todayKey = formatDateKey(new Date());
  const isViewingPastDate = selectedDateKey && selectedDateKey !== todayKey;

  // গত ৭ দিনের তালিকা এবং আর্কাইভের সামারি
  const daysList = useMemo(() => getPastDaysList(7), []);
  const archiveSummary = useMemo(() => getAvailableArchiveSummary(), []);

  // বছর, মাস ও দিন ভিত্তিক ড্রপডাউন স্টেট
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('11'); // November
  const [selectedDay, setSelectedDay] = useState('all'); // 'all' or '01'..'31'
  const [customCalendarDate, setCustomCalendarDate] = useState('');

  // ক্যালেন্ডার ইনপুট পরিবর্তন
  const handleCalendarChange = (e) => {
    const val = e.target.value;
    if (val) {
      setCustomCalendarDate(val);
      onSelectDateKey(val);
    }
  };

  // বছর/মাস/দিন ড্রপডাউন থেকে ফিল্টার প্রয়োগ
  const handleApplyDropdownFilter = () => {
    if (selectedDay !== 'all') {
      const formattedKey = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      onSelectDateKey(formattedKey);
    } else {
      const monthKey = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      onSelectDateKey(monthKey);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-3 sm:p-4 shadow-sm space-y-3 transition-all">
      {/* ১. হেডার ও স্ট্যাটাস বার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-amber-300/30">
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>দিন, মাস ও বছর ভিত্তিক ঐতিহাসিক আর্কাইভ</span>
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 hidden md:inline font-medium">
            আজকের খবরের পাশাপাশি পূর্ববর্তী যেকোনো দিন বা মাসের খবর সুনির্দিষ্টভাবে ব্রাউজ করুন
          </span>
        </div>

        {/* যদি অতীতের কোনো তারিখে থাকে, তবে আজকের লাইভে ফেরার বাটন */}
        {isViewingPastDate && (
          <button
            onClick={() => onSelectDateKey(todayKey)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto active:scale-95"
            title="আজকের লাইভ সংবাদ ফিডে ফিরুন"
          >
            <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>আজকের তাজা খবরে ফিরুন</span>
          </button>
        )}
      </div>

      {/* ২. দ্রুত দিন ভিত্তিক কুইক পিলস (আজ, গতকাল, ১৮ নভেম্বর, ১৭ নভেম্বর...) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-bold px-0.5">
          <span>দ্রুত দিন নির্বাচন:</span>
          {selectedDateKey && (
            <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
              নির্বাচিত: {formatBanglaDateLabel(selectedDateKey)} ({toBanglaDigit(totalEventsForDate)}টি খবর)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {daysList.map((day) => {
            const isSelected = selectedDateKey === day.dateKey;

            return (
              <button
                key={day.dateKey}
                onClick={() => onSelectDateKey(day.dateKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 border cursor-pointer ${isSelected
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white border-stone-950 dark:border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                  }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400 dark:text-white' : 'text-stone-400'}`} />
                <span>{day.shortLabel}</span>
                {day.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}>
                    {toBanglaDigit(day.count)}
                  </span>
                )}
              </button>
            );
          })}

          {/* সকল আর্কাইভ ভিউ বাটন */}
          <button
            onClick={() => onSelectDateKey('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1 border cursor-pointer ${selectedDateKey === 'all'
                ? 'bg-stone-900 dark:bg-emerald-700 text-white border-stone-950 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
          >
            <span>সকল আর্কাইভ ({toBanglaDigit(archiveSummary.totalStories || 383)})</span>
          </button>
        </div>
      </div>

      {/* ৩. বছর, মাস ও দিন ভিত্তিক অ্যাডভান্সড ড্রপডাউন ও ক্যালেন্ডার ইনপুট */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-bold whitespace-nowrap flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>সুনির্দিষ্ট আর্কাইভ:</span>
        </span>

        {/* বছর ড্রপডাউন */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold outline-none cursor-pointer hover:border-emerald-500 transition-colors"
        >
          {archiveSummary.years.map(yr => (
            <option key={yr} value={yr}>বছর: {toBanglaDigit(yr)}</option>
          ))}
          <option value="2025">বছর: ২০২৫</option>
          <option value="2024">বছর: ২০২৪</option>
        </select>

        {/* মাস ড্রপডাউন */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold outline-none cursor-pointer hover:border-emerald-500 transition-colors"
        >
          {BANGLA_MONTHS.map((mName, idx) => {
            const mVal = String(idx + 1).padStart(2, '0');
            return (
              <option key={mVal} value={mVal}>
                মাস: {mName}
              </option>
            );
          })}
        </select>

        {/* দিন ড্রপডাউন */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold outline-none cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <option value="all">পুরো মাসের সকল দিন</option>
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
            <option key={d} value={d}>
              দিন: {toBanglaDigit(d)} তারিখ
            </option>
          ))}
        </select>

        {/* ফিল্টার প্রয়োগ বাটন */}
        <button
          onClick={handleApplyDropdownFilter}
          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>খুঁজুন</span>
        </button>

        {/* সরাসরি ক্যালেন্ডার ইনপুট */}
        <div className="flex items-center gap-1.5 ml-auto">
          <label className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold flex items-center gap-1.5 cursor-pointer hover:border-emerald-400 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="hidden sm:inline">ক্যালেন্ডার:</span>
            <input
              type="date"
              max={todayKey}
              value={customCalendarDate || (selectedDateKey.length === 10 ? selectedDateKey : '')}
              onChange={handleCalendarChange}
              className="text-xs bg-transparent border-none outline-none font-sans font-bold cursor-pointer text-stone-800 dark:text-stone-200"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
