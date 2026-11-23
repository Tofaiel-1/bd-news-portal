import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DIVISIONS, DISTRICTS } from '../data/locations';

export default function LocationSelectorModal({
  selectedLocation,
  onSelectLocation,
  onClose,
  savedLocations = [],
  onToggleSaveLocation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionTab, setSelectedDivisionTab] = useState(selectedLocation?.divisionId || 'dhaka');
  const [selectedDistrictItem, setSelectedDistrictItem] = useState(
    DISTRICTS.find(d => d.id === selectedLocation?.districtId) || null
  );

  // সার্চ কুয়েরির ভিত্তিতে জেলা ও উপজেলার ফিল্টার
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    const matches = [];
    DISTRICTS.forEach(dist => {
      const matchDistrict = 
        dist.nameBn.toLowerCase().includes(q) ||
        dist.nameEn.toLowerCase().includes(q) ||
        dist.aliases.some(a => a.toLowerCase().includes(q));

      if (matchDistrict) {
        matches.push({
          type: 'district',
          district: dist,
          division: DIVISIONS.find(v => v.id === dist.divisionId)
        });
      }

      dist.upazilas.forEach(upz => {
        if (upz.toLowerCase().includes(q)) {
          matches.push({
            type: 'upazila',
            upazilaBn: upz,
            district: dist,
            division: DIVISIONS.find(v => v.id === dist.divisionId)
          });
        }
      });
    });

    return matches.slice(0, 15);
  }, [searchQuery]);

  // বর্তমান নির্বাচিত বিভাগের জেলাসমূহ
  const currentDivisionDistricts = useMemo(() => {
    if (selectedDivisionTab === 'all') return DISTRICTS;
    return DISTRICTS.filter(d => d.divisionId === selectedDivisionTab);
  }, [selectedDivisionTab]);

  const isLocationSaved = (distId, upzName) => {
    return savedLocations.some(l => l.districtId === distId && l.upazilaBn === upzName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                বাংলাদেশ প্রশাসনিক এলাকা নির্বাচন করুন
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                ৮ বিভাগ, ৬৪ জেলা ও ৪৯৫+ উপজেলার যেকোনো স্থানীয় সংবাদে সরাসরি প্রবেশ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-300 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* সার্চ বার */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="জেলা বা উপজেলার নাম লিখুন (যেমন: সাভার, কুমিল্লা, Bogura, শিবগঞ্জ, টেকনাফ)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-sans"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                মুছুন
              </button>
            )}
          </div>
        </div>

        {/* সার্চ ফলাফল প্রদর্শন */}
        {searchQuery ? (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[400px] space-y-2">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              অনুসন্ধান ফলাফল ({searchResults.length}টি মিল পাওয়া গেছে):
            </div>
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.type === 'upazila') {
                      onSelectLocation({
                        divisionId: item.division.id,
                        districtId: item.district.id,
                        upazilaBn: item.upazilaBn
                      });
                    } else {
                      onSelectLocation({
                        divisionId: item.division.id,
                        districtId: item.district.id,
                        upazilaBn: null
                      });
                    }
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {item.type === 'upazila' ? `${item.upazilaBn} উপজেলা` : `${item.district.nameBn} জেলা`}
                      </div>
                      <div className="text-xs text-stone-500">
                        {item.district.nameBn} জেলা • {item.division.nameBn} বিভাগ
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-500">
                "{searchQuery}" নামে কোনো জেলা বা উপজেলা খুঁজে পাওয়া যায়নি। সঠিক বানান দিয়ে পুনরায় চেষ্টা করুন।
              </div>
            )}
          </div>
        ) : (
          /* বিভাগ ও জেলা ড্রিলডাউন ভিউ */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[420px]">
            {/* বাম কলাম: ৮টি বিভাগ */}
            <div className="md:col-span-4 border-r border-stone-200 bg-stone-50/60 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                বিভাগ নির্বাচন
              </div>

              <button
                onClick={() => {
                  setSelectedDivisionTab('all');
                  setSelectedDistrictItem(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedDivisionTab === 'all'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <span>সমগ্র বাংলাদেশ</span>
                <span className="text-[10px] opacity-70">৬৪ জেলা</span>
              </button>

              {DIVISIONS.map(div => {
                const isActive = selectedDivisionTab === div.id;
                return (
                  <button
                    key={div.id}
                    onClick={() => {
                      setSelectedDivisionTab(div.id);
                      const firstDist = DISTRICTS.find(d => d.divisionId === div.id);
                      setSelectedDistrictItem(firstDist);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                  >
                    <span>{div.nameBn} বিভাগ</span>
                    <span className="text-[10px] opacity-70 font-mono">({div.districtsCount} জেলা)</span>
                  </button>
                );
              })}
            </div>

            {/* মাঝের কলাম: নির্বাচিত বিভাগের জেলাসমূহ */}
            <div className="md:col-span-4 border-r border-stone-200 bg-white overflow-y-auto p-3 space-y-1.5">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 pb-1">
                জেলা নির্বাচন ({currentDivisionDistricts.length}টি)
              </div>

              {currentDivisionDistricts.map(dist => {
                const isSelected = selectedDistrictItem?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onClick={() => setSelectedDistrictItem(dist)}
                    className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                        : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{dist.nameBn} জেলা</div>
                      <div className="text-[10px] text-stone-400 font-mono">{dist.nameEn}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLocation({
                          divisionId: dist.divisionId,
                          districtId: dist.id,
                          upazilaBn: null
                        });
                        onClose();
                      }}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-emerald-600 hover:text-white text-[10px] font-semibold text-stone-600 transition-colors"
                      title="এই সম্পূর্ণ জেলা নির্বাচন করুন"
                    >
                      নির্বাচন
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ডান কলাম: নির্বাচিত জেলার উপজেলা ও থানাসমূহ */}
            <div className="md:col-span-4 bg-stone-50/30 overflow-y-auto p-4 space-y-2">
              {selectedDistrictItem ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block font-bold">উপজেলা / থানা তালিকা</span>
                      <h4 className="font-serif text-sm font-bold text-stone-900">
                        {selectedDistrictItem.nameBn} ({selectedDistrictItem.upazilas.length}টি)
                      </h4>
                    </div>

                    <button
                      onClick={() => onToggleSaveLocation({
                        divisionId: selectedDistrictItem.divisionId,
                        divisionNameBn: DIVISIONS.find(v => v.id === selectedDistrictItem.divisionId)?.nameBn,
                        districtId: selectedDistrictItem.id,
                        nameBn: `${selectedDistrictItem.nameBn} জেলা`,
                        upazilaBn: null
                      })}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-600 transition-colors"
                      title="জেলা সংরক্ষণ করুন"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                    {selectedDistrictItem.upazilas.map((upz, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectLocation({
                            divisionId: selectedDistrictItem.divisionId,
                            districtId: selectedDistrictItem.id,
                            upazilaBn: upz
                          });
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-stone-200 text-xs font-medium text-stone-700 transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <span>{upz}</span>
                        <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center text-xs text-stone-400">
                  উপজেলার তালিকা দেখতে বাম পাশ থেকে যেকোনো একটি জেলা নির্বাচন করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* ফুটার */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onSelectLocation({ divisionId: 'all', districtId: null, upazilaBn: null });
              onClose();
            }}
            className="text-stone-600 hover:text-stone-900 font-semibold underline"
          >
            ফিল্টার রিসেট করে সব বাংলাদেশ দেখুন
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
}
