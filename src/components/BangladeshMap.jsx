import React, { useState } from 'react';
import { MapPin, Navigation, Eye, CheckCircle2, AlertTriangle, Layers, Info } from 'lucide-react';
import { DIVISIONS, DISTRICTS } from '../data/locations';

// প্রজেকশন স্কেলিং: বাংলাদেশের ল্যাটিটিউড (20.5 to 26.7) ও লংগিটিউড (88.0 to 92.7) কে SVG কোঅর্ডিনেটে ম্যাপিং
const projectCoordinates = (lat, lng, width = 600, height = 740) => {
  const minLng = 88.0;
  const maxLng = 92.8;
  const minLat = 20.6;
  const maxLat = 26.7;

  const x = ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
  const y = height - (((lat - minLat) / (maxLat - minLat)) * (height - 80) + 40);
  return { x, y };
};

// বাংলাদেশের ৮টি বিভাগের নান্দনিক পলিগন ভেক্টর পাথ
const DIVISION_PATHS = {
  rangpur: {
    path: "M 100 30 L 160 30 L 220 50 L 240 100 L 220 180 L 170 190 L 120 180 L 80 120 Z",
    center: { lat: 25.75, lng: 89.25 },
    color: "#059669"
  },
  rajshahi: {
    path: "M 70 140 L 120 180 L 170 190 L 220 180 L 210 270 L 160 320 L 70 270 L 50 180 Z",
    center: { lat: 24.5, lng: 88.8 },
    color: "#10b981"
  },
  mymensingh: {
    path: "M 220 120 L 290 120 L 330 160 L 320 230 L 260 250 L 220 180 Z",
    center: { lat: 24.8, lng: 90.4 },
    color: "#14b8a6"
  },
  sylhet: {
    path: "M 330 140 L 440 140 L 480 200 L 450 270 L 370 270 L 320 220 Z",
    center: { lat: 24.7, lng: 91.7 },
    color: "#0284c7"
  },
  dhaka: {
    path: "M 190 260 L 260 250 L 320 230 L 370 270 L 350 360 L 290 400 L 230 380 L 170 330 Z",
    center: { lat: 23.85, lng: 90.2 },
    color: "#047857"
  },
  khulna: {
    path: "M 130 320 L 180 340 L 230 380 L 230 520 L 150 560 L 90 470 L 100 370 Z",
    center: { lat: 22.8, lng: 89.3 },
    color: "#0d9488"
  },
  barishal: {
    path: "M 230 380 L 290 400 L 310 460 L 310 550 L 230 540 L 220 440 Z",
    center: { lat: 22.4, lng: 90.3 },
    color: "#0369a1"
  },
  chattogram: {
    path: "M 350 320 L 420 310 L 480 360 L 520 480 L 530 630 L 480 660 L 440 560 L 350 440 L 330 380 Z",
    center: { lat: 22.5, lng: 91.9 },
    color: "#0f766e"
  }
};

export default function BangladeshMap({
  selectedDivision,
  selectedDistrict,
  onSelectLocation,
  newsEvents = []
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredDivision, setHoveredDivision] = useState(null);

  // প্রতিটি জেলায় কতটি খবর আছে তার হিসাব
  const districtNewsCounts = React.useMemo(() => {
    const counts = {};
    newsEvents.forEach(evt => {
      const distId = evt.location.districtId;
      counts[distId] = (counts[distId] || 0) + 1;
    });
    return counts;
  }, [newsEvents]);

  // ফিল্টার করা জেলা তালিকা
  const displayedDistricts = React.useMemo(() => {
    if (!selectedDivision || selectedDivision === 'all') return DISTRICTS;
    return DISTRICTS.filter(d => d.divisionId === selectedDivision);
  }, [selectedDivision]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-newspaper overflow-hidden transition-all duration-300">
      {/* ম্যাপের শীর্ষ হেডার */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-gradient-to-r from-stone-50/90 to-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
              বাংলাদেশ লাইভ উপজেলা ও জেলা সংবাদ ম্যাপ
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              ৬৪ জেলা সক্রিয়
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 font-sans font-medium">
            যেকোনো বিভাগ বা জেলার পিন পয়েন্টে ক্লিক করে সরাসরি স্থানীয় যাচাইকৃত সংবাদ দেখুন
          </p>
        </div>

        {/* ফিল্টার রিসেট এবং স্ট্যাটাস নির্দেশিকা */}
        <div className="flex items-center gap-2 text-xs">
          {selectedDistrict && (
            <button
              onClick={() => onSelectLocation({ divisionId: selectedDivision, districtId: null })}
              className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors font-medium flex items-center gap-1 border border-stone-300 text-xs"
            >
              জেলা ফিল্টার মুছুন
            </button>
          )}
          {selectedDivision && selectedDivision !== 'all' && (
            <button
              onClick={() => onSelectLocation({ divisionId: 'all', districtId: null })}
              className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium flex items-center gap-1 border border-emerald-200 text-xs"
            >
              সব বাংলাদেশ
            </button>
          )}
        </div>
      </div>

      {/* বিভাগ বাছাই পিল বার */}
      <div className="px-4 py-2.5 bg-stone-50/50 border-b border-stone-100 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <button
          onClick={() => onSelectLocation({ divisionId: 'all', districtId: null })}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !selectedDivision || selectedDivision === 'all'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
          }`}
        >
          সমগ্র বাংলাদেশ
        </button>
        {DIVISIONS.map(div => {
          const isSelected = selectedDivision === div.id;
          return (
            <button
              key={div.id}
              onClick={() => onSelectLocation({ divisionId: div.id, districtId: null })}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30 font-semibold'
                  : 'bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200'
              }`}
            >
              {div.nameBn} বিভাগ
            </button>
          );
        })}
      </div>

      {/* মূল ম্যাপ ভিউ এবং ইনফো সাইডবার */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative bg-[#F8FAF9]">
        {/* SVG ইন্টারঅ্যাকটিভ বাংলাদেশ ম্যাপ (8 কলাম) */}
        <div className="lg:col-span-8 p-3 sm:p-6 flex items-center justify-center relative min-h-[440px] sm:min-h-[520px]">
          <svg
            viewBox="0 0 580 700"
            className="w-full max-w-[480px] h-auto drop-shadow-md select-none"
            style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.06))' }}
          >
            <defs>
              <linearGradient id="bgWater" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* বঙ্গোপসাগর ও জলপ্রপাত ব্যাকগ্রাউন্ড ইঙ্গিত */}
            <path
              d="M 20 600 Q 280 580 560 620 L 560 690 L 20 690 Z"
              fill="url(#bgWater)"
              className="pointer-events-none"
            />
            <text x="320" y="650" fill="#0284c7" opacity="0.3" fontSize="16" fontFamily="Hind Siliguri" fontWeight="600" textAnchor="middle">
              বঙ্গোপসাগর (Bay of Bengal)
            </text>

            {/* ৮টি প্রশাসনিক বিভাগ ভেক্টর */}
            {Object.entries(DIVISION_PATHS).map(([divKey, data]) => {
              const isSelected = selectedDivision === divKey;
              const isHovered = hoveredDivision === divKey;
              return (
                <path
                  key={divKey}
                  d={data.path}
                  fill={isSelected ? '#047857' : isHovered ? '#059669' : '#10b981'}
                  fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
                  stroke={isSelected ? '#047857' : isHovered ? '#059669' : '#94a3b8'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDivision(divKey)}
                  onMouseLeave={() => setHoveredDivision(null)}
                  onClick={() => onSelectLocation({ divisionId: divKey, districtId: null })}
                />
              );
            })}

            {/* ৬৪টি জেলার পিন পয়েন্ট ও নিউজ হটস্পট মার্কার */}
            {displayedDistricts.map(dist => {
              const { x, y } = projectCoordinates(dist.lat, dist.lng, 580, 700);
              const newsCount = districtNewsCounts[dist.id] || 0;
              const hasNews = newsCount > 0;
              const isSelected = selectedDistrict === dist.id;
              const isHovered = hoveredDistrict?.id === dist.id;

              return (
                <g
                  key={dist.id}
                  className="cursor-pointer transition-transform duration-200 group"
                  onMouseEnter={() => setHoveredDistrict(dist)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation({ divisionId: dist.divisionId, districtId: dist.id });
                  }}
                >
                  {/* নিউজ থাকলে ব্যাকগ্রাউন্ড এনিমেটেড পালস */}
                  {hasNews && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 16 : isHovered ? 14 : 10}
                      fill="#10b981"
                      fillOpacity={0.3}
                      className="animate-ping"
                      style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '2.5s' }}
                    />
                  )}

                  {/* জেলা সার্কেল নোড */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : isHovered ? 7 : hasNews ? 5.5 : 3.5}
                    fill={isSelected ? '#dc2626' : hasNews ? '#059669' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200 shadow-sm"
                  />

                  {/* জেলা নাম লেবেল (বাছাই করা বা নিউজ থাকা জেলায় স্পষ্ট দেখানো) */}
                  {(isSelected || hasNews || isHovered) && (
                    <g transform={`translate(${x}, ${y - 10})`}>
                      <rect
                        x="-24"
                        y="-14"
                        width="48"
                        height="16"
                        rx="4"
                        fill={isSelected ? '#111827' : hasNews ? '#064e3b' : '#334155'}
                        className="shadow-md"
                      />
                      <text
                        x="0"
                        y="-3"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="Hind Siliguri"
                      >
                        {dist.nameBn}
                      </text>
                      {hasNews && (
                        <circle
                          cx="22"
                          cy="-6"
                          r="4"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* ম্যাপ লেজেন্ড ফ্লোটিং প্যানেল */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-stone-200/80 shadow-sm text-[11px] font-sans flex flex-col gap-1.5 pointer-events-none">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-100">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> ম্যাপ নির্দেশিকা
            </span>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200 flex-shrink-0" />
              <span>যাচাইকৃত খবর উপস্থিত ({Object.keys(districtNewsCounts).length} জেলা)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-slate-500 flex-shrink-0" />
              <span>নজরদারিতে থাকা জেলা</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0 ring-2 ring-red-200" />
              <span>নির্বাচিত জেলা / থানা</span>
            </div>
          </div>
        </div>

        {/* ডানদিকের ইন্টারেক্টিভ জেলা প্যানেল ও লাইভ আপডেট (4 কলাম) */}
        <div className="lg:col-span-4 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white flex flex-col justify-between">
          <div>
            {/* নির্বাচিত এলাকার তথ্য কার্ড */}
            {selectedDistrict ? (
              (() => {
                const currentDist = DISTRICTS.find(d => d.id === selectedDistrict);
                const currentDiv = DIVISIONS.find(v => v.id === currentDist?.divisionId);
                const distEvents = newsEvents.filter(e => e.location.districtId === selectedDistrict);

                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {currentDiv?.nameBn} বিভাগ
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {currentDist?.nameEn}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                        {currentDist?.nameBn} জেলা
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        উপজেলা ও থানা: {currentDist?.upazilas?.slice(0, 5).join(', ')}... (মোট {currentDist?.upazilas?.length}টি)
                      </p>

                      <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                        <span className="text-stone-600">সর্বশেষ প্রতিবেদন:</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {distEvents.length}টি ঘটনা যাচাইকৃত
                        </span>
                      </div>
                    </div>

                    {/* এই জেলার খবর থাকলে ছোট তালিকা */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        এই জেলার সর্বশেষ যাচাইকৃত খবর
                      </h4>
                      {distEvents.length > 0 ? (
                        <div className="space-y-2">
                          {distEvents.map(evt => (
                            <div
                              key={evt.id}
                              onClick={() => onSelectLocation({ divisionId: evt.location.divisionId, districtId: evt.location.districtId, eventId: evt.id })}
                              className="p-3 rounded-lg border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {evt.location.upazilaBn}
                                </span>
                                <span>{evt.time_ago}</span>
                              </div>
                              <h5 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-emerald-800 line-clamp-2">
                                {evt.canonical_bangla_title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500">
                                <span>{evt.independence.independent_source_count}টি স্বাধীন উৎস</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-medium">বিশ্বাসযোগ্যতা {evt.confidence}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-stone-50 text-center text-xs text-stone-500 border border-dashed border-stone-300">
                          এই জেলায় এই মুহূর্তে কোনো ব্রেকিং বা অমিল রিপোর্ট নেই। সার্বিক পরিস্থিতি স্বাভাবিক।
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : hoveredDistrict ? (
              // হোভার করলে জেলার প্রাকদর্শন
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>জেলা বিবরণ</span>
                  <span className="font-mono">{hoveredDistrict.nameEn}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  {hoveredDistrict.nameBn} জেলা
                </h3>
                <p className="text-xs text-stone-600 mt-2">
                  উপজেলাসমূহ: {hoveredDistrict.upazilas.slice(0, 6).join(', ')}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ক্লিক করে এই জেলার সব খবর ফিল্টার করুন</span>
                </div>
              </div>
            ) : (
              // ডিফল্ট জাতীয় পরিসংখ্যান ও দ্রুত নেভিগেশন
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-900 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    জাতীয় সংবাদ কভারেজ স্ট্যাটাস
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold mt-1 text-white">
                    ৬৪ জেলা ও ৪৯৫+ উপজেলার সংবাদ ভেরিফিকেশন নেটওয়ার্ক
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-stone-800 text-xs sm:text-sm">
                    <div>
                      <div className="text-stone-300 font-medium">সক্রিয় স্বাধীন উৎস</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">৪০+ গণমাধ্যম</div>
                    </div>
                    <div>
                      <div className="text-stone-300 font-medium">বর্তমান যাচাই নির্ভুলতা</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">৯৬.৪%</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs sm:text-sm text-stone-700 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>ম্যাপের মূল বৈশিষ্ট্য:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                    <li>এক ক্লিকে বিভাগ ও জেলাওয়ারি খবর আলাদা করুন</li>
                    <li>প্রতিটি ইভেন্টে বহু-উৎস দাবির ক্রস-চেক ও প্রমাণের স্তর</li>
                    <li>গুজব ও পরস্পরবিরোধী দাবির তাৎক্ষণিক সতর্কবার্তা</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* দ্রুত জনপ্রিয় জেলা তালিকা */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              জনপ্রিয় জেলা দ্রুত নির্বাচন:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'dhaka-dist', name: 'ঢাকা' },
                { id: 'chattogram-dist', name: 'চট্টগ্রাম' },
                { id: 'sylhet-dist', name: 'সিলেট' },
                { id: 'rajshahi-dist', name: 'রাজশাহী' },
                { id: 'coxsbazar', name: 'কক্সবাজার' },
                { id: 'bogura', name: 'বগুড়া' },
                { id: 'khulna-dist', name: 'খুলনা' },
                { id: 'barishal-dist', name: 'বরিশাল' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelectLocation({ divisionId: null, districtId: item.id })}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 text-xs transition-colors font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
