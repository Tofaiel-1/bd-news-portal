import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info, 
  Flame, 
  RotateCcw,
  Sparkles,
  Compass,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DIVISIONS, DISTRICTS } from '../data/locations';
import { 
  REALISTIC_DIVISION_VECTORS, 
  MAJOR_RIVER_VECTORS, 
  COASTAL_ISLANDS, 
  projectGeoCoordinates 
} from '../data/bangladeshGeoPaths';
import { toBanglaNumber } from './Header';
import { getWeatherPrayerForLocation } from '../data/weatherPrayerData';

export default function RealisticBangladeshMap({
  selectedDivision,
  selectedDistrict,
  onSelectLocation,
  newsEvents = []
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredDivision, setHoveredDivision] = useState(null);
  const [showRiverLayer, setShowRiverLayer] = useState(true);

  // প্রতিটি জেলায় কতটি খবর আছে তার রিয়েল-টাইম গণনা
  const districtStats = useMemo(() => {
    const stats = {};
    newsEvents.forEach(evt => {
      const dId = evt.location?.districtId;
      if (!dId) return;
      if (!stats[dId]) {
        stats[dId] = {
          count: 0,
          breakingCount: 0,
          latestNews: null
        };
      }
      stats[dId].count += 1;
      if (evt.freshness === 'breaking') stats[dId].breakingCount += 1;
      if (!stats[dId].latestNews) stats[dId].latestNews = evt;
    });
    return stats;
  }, [newsEvents]);

  // বর্তমান সক্রিয় বা হোভারকৃত জেলা
  const activeDistrictObj = useMemo(() => {
    const targetId = hoveredDistrict?.id || selectedDistrict;
    if (!targetId) return null;
    return DISTRICTS.find(d => d.id === targetId);
  }, [hoveredDistrict, selectedDistrict]);

  const activeDivisionObj = useMemo(() => {
    const targetId = hoveredDivision?.id || selectedDivision;
    if (!targetId || targetId === 'all') return null;
    return DIVISIONS.find(d => d.id === targetId);
  }, [hoveredDivision, selectedDivision]);

  // নির্বাচিত এলাকার আবহাওয়া
  const activeWeather = useMemo(() => {
    const divId = activeDistrictObj?.divisionId || activeDivisionObj?.id || 'dhaka';
    return getWeatherPrayerForLocation(divId);
  }, [activeDistrictObj, activeDivisionObj]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-newspaper overflow-hidden transition-all duration-300">
      {/* ম্যাপের শীর্ষ হেডার ও ইউটিলিটি কন্ট্রোল */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-gradient-to-r from-stone-50 via-white to-emerald-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              বাস্তবধর্মী বাংলাদেশ ভৌগোলিক মানচিত্র
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              ৬৪ জেলা সক্রিয়
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 font-sans font-medium">
            বাংলাদেশের ৮টি প্রশাসনিক বিভাগ, নদীপথ ও উপকূলীয় ৬৪ জেলার লাইভ সংবাদ অবস্থান
          </p>
        </div>

        {/* নদী লেয়ার ও ভিউ রিসেট কন্ট্রোল */}
        <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
          <button
            onClick={() => setShowRiverLayer(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showRiverLayer 
                ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-sm' 
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>নদীপথ লেয়ার</span>
          </button>

          {(selectedDistrict || (selectedDivision && selectedDivision !== 'all')) && (
            <button
              onClick={() => onSelectLocation({ divisionId: 'all', districtId: null, upazilaBn: null })}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সারাদেশ ভিউ</span>
            </button>
          )}
        </div>
      </div>

      {/* ৮ বিভাগের দ্রুত নির্বাচন ফিল্টার স্ট্রিপ */}
      <div className="px-4 py-2.5 bg-stone-50/70 border-b border-stone-200/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          onClick={() => onSelectLocation({ divisionId: 'all', districtId: null, upazilaBn: null })}
          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
            !selectedDivision || selectedDivision === 'all'
              ? 'bg-stone-900 text-white border-stone-950 shadow-sm ring-2 ring-emerald-500/30'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          🇧🇩 সমগ্র বাংলাদেশ
        </button>

        {DIVISIONS.map(div => {
          const isSelected = selectedDivision === div.id;
          return (
            <button
              key={div.id}
              onClick={() => onSelectLocation({ divisionId: div.id, districtId: null, upazilaBn: null })}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-500/40'
                  : 'bg-white text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 border-stone-300'
              }`}
            >
              {div.nameBn} বিভাগ
            </button>
          );
        })}
      </div>

      {/* মূল মানচিত্র ও সাইড ইন্সপেকশন গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative bg-gradient-to-b from-[#F4F9F6] via-white to-[#EBF4EE]">
        {/* SVG বাস্তব বাংলাদেশ ভৌগোলিক ভেক্টর ক্যানভাস (৭ কলাম) */}
        <div className="lg:col-span-7 p-3 sm:p-6 flex items-center justify-center relative min-h-[480px] sm:min-h-[580px] select-none">
          <svg
            viewBox="0 0 600 760"
            className="w-full max-w-[500px] h-auto drop-shadow-xl"
            style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.08))' }}
          >
            <defs>
              {/* বঙ্গোপসাগর ওয়াটার শেড গ্রেডিয়েন্ট */}
              <linearGradient id="bayOfBengalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>

              {/* অ্যাক্টিভ ডিভিশন গ্লো */}
              <filter id="activeGlow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#059669" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* বঙ্গোপসাগর উপকূল ও জলরাশি ইঙ্গিত */}
            <path
              d="M 50 640 Q 280 610 560 660 L 560 750 L 50 750 Z"
              fill="url(#bayOfBengalGrad)"
              className="transition-opacity duration-500"
            />
            <text x="320" y="715" fill="#0284c7" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">
              🌊 বঙ্গোপসাগর (Bay of Bengal)
            </text>

            {/* ৮টি বিভাগের নিখুঁত ভৌগোলিক ভেক্টর পাথ */}
            {Object.entries(REALISTIC_DIVISION_VECTORS).map(([key, div]) => {
              const isSelected = selectedDivision === div.id;
              const isHovered = hoveredDivision?.id === div.id;

              return (
                <g key={key} className="cursor-pointer transition-all duration-300">
                  <path
                    d={div.path}
                    fill={isSelected ? div.accentColor : div.color}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.72}
                    stroke={isSelected ? '#ffffff' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeLinejoin="round"
                    filter={isSelected ? 'url(#activeGlow)' : undefined}
                    onMouseEnter={() => setHoveredDivision(div)}
                    onMouseLeave={() => setHoveredDivision(null)}
                    onClick={() => onSelectLocation({ divisionId: div.id, districtId: null, upazilaBn: null })}
                    className="hover:scale-[1.01] transition-transform origin-center"
                  />
                  {/* বিভাগের নাম লেবেল */}
                  <text
                    x={div.labelPos.x}
                    y={div.labelPos.y}
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="800"
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow-md select-none font-sans"
                  >
                    {div.nameBn}
                  </text>
                </g>
              );
            })}

            {/* নদীপথ স্তর (পদ্মা, মেঘনা, যমুনা, কর্ণফুলী) */}
            {showRiverLayer && (
              <g className="pointer-events-none animate-fadeIn">
                {MAJOR_RIVER_VECTORS.map(riv => (
                  <path
                    key={riv.id}
                    d={riv.path}
                    stroke={riv.color}
                    strokeWidth={riv.strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                ))}
              </g>
            )}

            {/* উপকূলীয় দ্বীপসমূহ */}
            {COASTAL_ISLANDS.map(isl => (
              <path
                key={isl.id}
                d={isl.path}
                fill={isl.color}
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-100 opacity-90 transition-opacity"
              />
            ))}

            {/* ৬৪ জেলার সঠিক জিপিএস পিন মার্কারসমূহ */}
            {DISTRICTS.map(dist => {
              const pos = projectGeoCoordinates(dist.lat, dist.lng);
              const stats = districtStats[dist.id] || { count: 0, breakingCount: 0 };
              const isSelected = selectedDistrict === dist.id;
              const isHovered = hoveredDistrict?.id === dist.id;
              const hasBreaking = stats.breakingCount > 0;

              return (
                <g
                  key={dist.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredDistrict(dist)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation({ 
                      divisionId: dist.divisionId, 
                      districtId: isSelected ? null : dist.id, 
                      upazilaBn: null 
                    });
                  }}
                >
                  {/* ব্রেকিং নিউজ থাকলে পালসিং রিং */}
                  {hasBreaking && (
                    <circle
                      r="12"
                      fill="#ef4444"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}

                  {/* নির্বাচিত বা হোভার থাকলে আউটার রিং */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="9"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* সেন্ট্রাল জেলা ডট */}
                  <circle
                    r={isSelected ? 6 : isHovered ? 5.5 : 4}
                    fill={hasBreaking ? '#dc2626' : isSelected ? '#10b981' : '#ffffff'}
                    stroke="#1e293b"
                    strokeWidth="1.2"
                    className="transition-all duration-200 drop-shadow-sm"
                  />

                  {/* জেলা নাম (হোভার বা নির্বাচিত হলে বড় হয়ে দেখা যাবে) */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(0, -14)" className="animate-fadeIn">
                      <rect
                        x="-36"
                        y="-12"
                        width="72"
                        height="18"
                        rx="6"
                        fill="#0f172a"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="0"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-sans"
                      >
                        {dist.nameBn}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ডানদিকের ইনটেলিজেন্ট জেলা তথ্য ও সংবাদ ইন্সপেক্টর (৫ কলাম) */}
        <div className="lg:col-span-5 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-stone-200/90 flex flex-col justify-between bg-white/70 backdrop-blur-md">
          {activeDistrictObj ? (
            <div className="space-y-4 animate-fadeIn">
              {/* নির্বাচিত জেলার শীর্ষ বিবরণী */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>{activeDistrictObj.divisionId ? `${DIVISIONS.find(v => v.id === activeDistrictObj.divisionId)?.nameBn} বিভাগ` : 'বাংলাদেশ'}</span>
                  </span>
                  <span className="font-mono text-stone-500 font-normal">{activeDistrictObj.nameEn} District</span>
                </div>

                <h3 className="font-serif text-2xl font-black text-stone-900 leading-tight">
                  {activeDistrictObj.nameBn} জেলা
                </h3>

                <p className="text-xs text-stone-600 mt-2 font-sans line-clamp-2">
                  <strong className="text-stone-800">উপজেলাসমূহ ({toBanglaNumber(activeDistrictObj.upazilas.length)}টি):</strong>{' '}
                  {activeDistrictObj.upazilas.join(', ')}
                </p>

                {/* এই জেলার লাইভ আবহাওয়া ও ওয়াক্ত */}
                <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-serif font-black text-stone-900">
                      {toBanglaNumber(activeWeather.temp)}°C
                    </span>
                    <span className="text-stone-600 font-medium">{activeWeather.condition}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                    বাতাস AQI: {activeWeather.aqi}
                  </span>
                </div>
              </div>

              {/* এই জেলার সংবাদ স্ট্যাটাস ও তাজা হেডলাইন */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-800">
                  <span>সংবাদ কভারেজ:</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {toBanglaNumber(districtStats[activeDistrictObj.id]?.count || 0)}টি সক্রিয় সংবাদ
                  </span>
                </div>

                {districtStats[activeDistrictObj.id]?.latestNews ? (
                  <div 
                    onClick={() => onSelectLocation({ divisionId: activeDistrictObj.divisionId, districtId: activeDistrictObj.id, upazilaBn: null })}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider mb-1 inline-block">
                      {districtStats[activeDistrictObj.id]?.latestNews.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-emerald-700 leading-snug">
                      {districtStats[activeDistrictObj.id]?.latestNews.canonical_bangla_title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {districtStats[activeDistrictObj.id]?.latestNews.summary_bangla}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-600 space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="font-bold text-stone-800">এই মুহূর্তে কোনো ব্রেকিং অসংগতি নেই</p>
                    <p className="text-[11px] text-stone-500">মাঠপর্যায়ের ব্যুরো প্রতিনিধিরা নিয়মিত পরিস্থিতি পর্যবেক্ষণ করছেন।</p>
                  </div>
                )}

                <button
                  onClick={() => onSelectLocation({ divisionId: activeDistrictObj.divisionId, districtId: activeDistrictObj.id, upazilaBn: null })}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{activeDistrictObj.nameBn} জেলার সকল খবর দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // ডিফল্ট রাষ্ট্রীয় পরিসংখ্যান কার্ড
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>জাতীয় সত্যতা যাচাইকরণ নেটওয়ার্ক</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-white leading-tight">
                  ৬৪ জেলা ও ৪৯৫ উপজেলার লাইভ ভেক্টর মানচিত্র
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 font-sans leading-relaxed">
                  যেকোনো বিভাগ বা জেলার পিন পয়েন্টে ক্লিক করলেই সেই অঞ্চলের সত্যতা যাচাইকৃত খবর স্বয়ংক্রিয়ভাবে ফিল্টার হবে।
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-stone-800 text-xs">
                  <div>
                    <span className="text-stone-400 block">সক্রিয় স্বাধীন উৎস:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">শীর্ষ ৮+ পোর্টাল</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">ভৌগোলিক কভারেজ:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">১০০% সম্পূর্ণ</span>
                  </div>
                </div>
              </div>

              {/* মানচিত্র ব্যবহারের সহজ নির্দেশিকা */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 text-xs sm:text-sm text-stone-700">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>মানচিত্র ব্যবহারের নিয়ম:</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                  <li><span className="text-stone-800 font-semibold">বিভাগে ক্লিক:</span> সংশ্লিষ্ট বিভাগের সকল জেলা এক নজরে আসবে।</li>
                  <li><span className="text-stone-800 font-semibold">জেলার পিনে ক্লিক:</span> নির্দিষ্ট উপজেলার যাচাইকৃত সংবাদ লোড হবে।</li>
                  <li><span className="text-rose-600 font-semibold">লাল পালসিং ডট:</span> জরুরি ব্রেকিং নিউজ চলমান এলাকা।</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
