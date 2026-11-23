import React from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  Activity 
} from 'lucide-react';
import { getWeatherPrayerForLocation } from '../data/weatherPrayerData';
import { toBanglaNumber } from './Header';

export default function WeatherPrayerWidget({
  divisionId = 'dhaka',
  districtBn = 'ঢাকা',
  onOpenLocationModal,
  compact = false
}) {
  const data = getWeatherPrayerForLocation(divisionId);

  const getWeatherIcon = (cond) => {
    switch (cond) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />;
      case 'cloudy':
      case 'partly_cloudy':
        return <CloudSun className="w-5 h-5 text-sky-500" />;
      default:
        return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
  };

  // কমপ্যাক্ট সাইডবার ভিউ
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/60 border border-sky-200/90 rounded-3xl p-4 shadow-sm space-y-3">
        {/* টপ বার: জেলা ও আবহাওয়া */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-sky-100 flex items-center justify-center flex-shrink-0">
              {getWeatherIcon(data.conditionIcon)}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl font-black text-stone-900 leading-none">
                  {toBanglaNumber(data.temp)}°C
                </span>
                <span className="text-[11px] text-stone-500 font-sans">
                  (অনুভূত {toBanglaNumber(data.tempFeel)}°C)
                </span>
              </div>
              <span className="text-xs font-bold text-sky-800">{data.condition}</span>
            </div>
          </div>

          {onOpenLocationModal ? (
            <button
              onClick={onOpenLocationModal}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-sky-50 text-stone-700 border border-stone-200 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{districtBn || data.districtBn}</span>
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-xl bg-white text-stone-700 border border-stone-200 font-bold text-xs flex items-center gap-1 shadow-2xs">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{districtBn || data.districtBn}</span>
            </div>
          )}
        </div>

        {/* বাতাসের মান ও আর্দ্রতা */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-sky-100 font-medium">
          <span className="text-emerald-800 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>বাতাস AQI: <strong>{data.aqi}</strong></span>
          </span>
          <span className="text-sky-700 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>আর্দ্রতা: <strong>{data.humidity}</strong></span>
          </span>
        </div>

        {/* নামাজের সময়সূচী গ্রিড */}
        <div className="pt-2 border-t border-sky-100">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>নামাজের ওয়াক্ত</span>
            </span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              পরবর্তী: {data.prayers.currentNext.name} ({data.prayers.currentNext.time})
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-stone-500">ফজর</span>
              <span className="font-mono font-bold text-stone-900">{data.prayers.fajr}</span>
            </div>
            <div className="p-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-stone-500">জোহর</span>
              <span className="font-mono font-bold text-stone-900">{data.prayers.dhuhr}</span>
            </div>
            <div className="p-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-stone-500">আসর</span>
              <span className="font-mono font-bold text-stone-900">{data.prayers.asr}</span>
            </div>
            <div className="p-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-stone-500">এশা</span>
              <span className="font-mono font-bold text-stone-900">{data.prayers.isha}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ফুল-ওয়াইড ভিউ
  return (
    <div className="bg-gradient-to-r from-sky-50 via-teal-50/40 to-emerald-50/60 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border border-sky-200/80 dark:border-stone-800 rounded-3xl p-3 sm:p-4 shadow-newspaper overflow-hidden transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* বাম পাশ: আবহাওয়া ও জেলা */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-sky-100 dark:border-stone-700 flex items-center justify-center flex-shrink-0">
              {getWeatherIcon(data.conditionIcon)}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-black text-stone-900 dark:text-white leading-none">
                  {toBanglaNumber(data.temp)}°C
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  (অনুভূত {toBanglaNumber(data.tempFeel)}°C)
                </span>
              </div>
              <div className="text-xs font-semibold text-sky-800 dark:text-sky-300 leading-tight">
                {data.condition}
              </div>
            </div>
          </div>

          <div className="h-7 w-px bg-stone-200 dark:bg-stone-700 hidden sm:block" />

          {/* বায়ুর মান ও আর্দ্রতা */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium flex items-center gap-1 shadow-sm">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>বাতাস AQI: {data.aqi}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-medium flex items-center gap-1 shadow-sm hidden lg:flex">
              <Droplets className="w-3 h-3 text-sky-500" />
              <span>আর্দ্রতা {data.humidity}</span>
            </span>
          </div>

          {onOpenLocationModal ? (
            <button
              onClick={onOpenLocationModal}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 hover:bg-sky-50 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm ml-auto sm:ml-0"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{districtBn || data.districtBn}</span>
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1 shadow-sm ml-auto sm:ml-0">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{districtBn || data.districtBn}</span>
            </div>
          )}
        </div>

        {/* ডান পাশ: নামাজের সময়সূচী */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap mr-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>আজকের ওয়াক্ত:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-nowrap text-xs">
            <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 whitespace-nowrap text-center shadow-xs">
              <span className="block text-xs font-bold text-stone-600 dark:text-stone-300">ফজর</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{data.prayers.fajr}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 whitespace-nowrap text-center shadow-xs">
              <span className="block text-xs font-bold text-stone-600 dark:text-stone-300">জোহর</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{data.prayers.dhuhr}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 whitespace-nowrap text-center shadow-xs">
              <span className="block text-xs font-bold text-stone-600 dark:text-stone-300">আসর</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{data.prayers.asr}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white whitespace-nowrap text-center shadow-md scale-105 ring-2 ring-emerald-400/40">
              <span className="block text-xs text-emerald-100 font-bold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                {data.prayers.currentNext.name}
              </span>
              <span className="font-mono font-black text-xs sm:text-sm">{data.prayers.currentNext.time}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 whitespace-nowrap text-center shadow-xs">
              <span className="block text-xs font-bold text-stone-600 dark:text-stone-300">এশা</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{data.prayers.isha}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
