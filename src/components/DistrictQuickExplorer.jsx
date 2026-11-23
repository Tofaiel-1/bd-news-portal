import React from 'react';
import { MapPin, Navigation, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { DIVISIONS, DISTRICTS } from '../data/locations';

const DIVISION_THEMES = {
  dhaka: { gradient: 'from-emerald-600 to-teal-700', activeRing: 'ring-emerald-500', icon: '🏙️' },
  chattogram: { gradient: 'from-cyan-600 to-blue-700', activeRing: 'ring-cyan-500', icon: '🌊' },
  rajshahi: { gradient: 'from-amber-600 to-orange-700', activeRing: 'ring-amber-500', icon: '🌾' },
  khulna: { gradient: 'from-teal-600 to-emerald-700', activeRing: 'ring-teal-500', icon: '🌲' },
  barishal: { gradient: 'from-sky-600 to-indigo-700', activeRing: 'ring-sky-500', icon: '⛵' },
  sylhet: { gradient: 'from-emerald-700 to-green-800', activeRing: 'ring-emerald-600', icon: '🍵' },
  rangpur: { gradient: 'from-rose-600 to-pink-700', activeRing: 'ring-rose-500', icon: '🚜' },
  mymensingh: { gradient: 'from-violet-600 to-purple-700', activeRing: 'ring-violet-500', icon: '🏞️' }
};

export default function DistrictQuickExplorer({
  selectedDivisionId,
  selectedDistrictId,
  onSelectLocation,
  newsEvents = []
}) {
  // প্রতিটি বিভাগে কয়টি নিউজ আছে গণনা
  const divisionCounts = React.useMemo(() => {
    const counts = {};
    newsEvents.forEach(evt => {
      const divId = evt.location?.divisionId;
      if (divId) counts[divId] = (counts[divId] || 0) + 1;
    });
    return counts;
  }, [newsEvents]);

  // নির্বাচিত বিভাগের আওতাধীন জেলাসমূহ
  const currentDistricts = React.useMemo(() => {
    if (!selectedDivisionId || selectedDivisionId === 'all') return [];
    return DISTRICTS.filter(d => d.divisionId === selectedDivisionId);
  }, [selectedDivisionId]);

  return (
    <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-3xl border border-stone-200/90 dark:border-stone-800 p-3 sm:p-4 shadow-newspaper space-y-3">
      {/* হেডার */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-600/10 text-emerald-800 font-bold text-xs sm:text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>৬৪ জেলা ও উপজেলা সংবাদ এক্সপ্লোরার</span>
          </span>
          <span className="text-xs text-stone-700 font-sans hidden sm:inline font-medium">
            আপনার জেলা নির্বাচন করলেই সরাসরি স্থানীয় খবর ও ইউটিউব/ফেসবুক বুলেটিন ফিল্টার হবে
          </span>
        </div>

        {selectedDivisionId !== 'all' && (
          <button
            onClick={() => onSelectLocation({ divisionId: 'all', districtId: null, upazilaBn: null })}
            className="text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
          >
            সব বিভাগ দেখুন
          </button>
        )}
      </div>

      {/* ৮টি বিভাগের জামকালো কালারফুল পিলস */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => onSelectLocation({ divisionId: 'all', districtId: null, upazilaBn: null })}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
            selectedDivisionId === 'all'
              ? 'bg-stone-950 text-white border-stone-900 shadow-md ring-2 ring-emerald-500/40'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
          }`}
        >
          <span>🇧🇩 সমগ্র বাংলাদেশ</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-stone-200 text-stone-800 font-bold">
            {newsEvents.length}
          </span>
        </button>

        {DIVISIONS.map(div => {
          const isSelected = selectedDivisionId === div.id;
          const theme = DIVISION_THEMES[div.id] || { gradient: 'from-stone-800 to-stone-900', activeRing: 'ring-stone-500', icon: '📍' };
          const count = divisionCounts[div.id] || 0;

          return (
            <button
              key={div.id}
              onClick={() => onSelectLocation({ divisionId: div.id, districtId: null, upazilaBn: null })}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ring-2 ${theme.activeRing}`
                  : 'bg-stone-50 hover:bg-stone-100/90 text-stone-800 border-stone-300'
              }`}
            >
              <span>{theme.icon}</span>
              <span>{div.nameBn} বিভাগ</span>
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {count}টি
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* যদি কোনো বিভাগ নির্বাচিত থাকে তবে তার আওতাধীন জেলাসমূহের সাব-বার */}
      {currentDistricts.length > 0 && (
        <div className="pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none animate-fadeIn">
          <span className="text-xs font-bold text-stone-800 whitespace-nowrap mr-1">
            জেলাসমূহ:
          </span>
          {currentDistricts.map(dist => {
            const isDistSelected = selectedDistrictId === dist.id;
            const distNewsCount = newsEvents.filter(e => e.location?.districtId === dist.id).length;

            return (
              <button
                key={dist.id}
                onClick={() => onSelectLocation({ divisionId: selectedDivisionId, districtId: isDistSelected ? null : dist.id, upazilaBn: null })}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isDistSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
              >
                <span>{dist.nameBn}</span>
                {distNewsCount > 0 && (
                  <span className="ml-1 text-xs font-mono font-bold">({distNewsCount})</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
