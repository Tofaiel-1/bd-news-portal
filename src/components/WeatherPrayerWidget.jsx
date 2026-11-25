import React from 'react';
import {
  CloudSun,
  Sun,
  Droplets,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import { getWeatherPrayerForLocation } from '../data/weatherPrayerData';
import { toBanglaNumber } from '../utils/dateUtils';

// ঢাকার বর্তমান সময় অনুযায়ী পরবর্তী নামাজের ওয়াক্ত নির্ণয়
function computeCurrentNextPrayer(prayers) {
  try {
    const bdStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    const bd = new Date(bdStr);
    const totalMins = bd.getHours() * 60 + bd.getMinutes();

    // আনুমানিক ওয়াক্ত সময় (মিনিটে)
    const schedule = [
      { name: 'ফজর', time: prayers.fajr, mins: 5 * 60 + 4 },
      { name: 'যোহর', time: prayers.dhuhr, mins: 11 * 60 + 53 },
      { name: 'আসর', time: prayers.asr, mins: 15 * 60 + 56 },
      { name: 'মাগরিব', time: prayers.maghrib, mins: 17 * 60 + 14 },
      { name: 'এশা', time: prayers.isha, mins: 18 * 60 + 32 }
    ];

    for (const s of schedule) {
      if (totalMins < s.mins) {
        return { name: s.name, time: s.time };
      }
    }
    return { name: 'ফজর', time: prayers.fajr };
  } catch {
    return prayers.currentNext;
  }
}

export default function WeatherPrayerWidget({
  divisionId = 'dhaka',
  districtBn = 'ঢাকা',
  onOpenLocationModal,
  compact = false
}) {
  const data = getWeatherPrayerForLocation(divisionId);
  const nextPrayer = computeCurrentNextPrayer(data.prayers);

  const getWeatherIcon = (cond) => {
    switch (cond) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloudy':
      case 'partly_cloudy':
        return <CloudSun className="w-5 h-5 text-sky-500" />;
      default:
        return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/60 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/30 border border-sky-200/90 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 shadow-xs border border-sky-100 dark:border-stone-700 flex items-center justify-center flex-shrink-0">
              {getWeatherIcon(data.conditionIcon)}
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl font-black text-stone-900 dark:text-stone-100 leading-none">
                  {toBanglaNumber(data.temp)}°C
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                  (অনুভূত {toBanglaNumber(data.tempFeel)}°C)
                </span>
              </div>
              <span className="text-xs font-bold text-sky-800 dark:text-sky-400">{data.condition}</span>
            </div>
          </div>

          {onOpenLocationModal ? (
            <button
              onClick={onOpenLocationModal}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 hover:bg-sky-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{districtBn || data.districtBn}</span>
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1 shadow-2xs">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{districtBn || data.districtBn}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-sky-100 dark:border-stone-800 font-medium">
          <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>বাতাস AQI: <strong>{data.aqi}</strong></span>
          </span>
          <span className="text-sky-700 dark:text-sky-400 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>আর্দ্রতা: <strong>{data.humidity}</strong></span>
          </span>
        </div>

        <div className="pt-2 border-t border-sky-100 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>নামাজের ওয়াক্ত</span>
            </span>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800">
              পরবর্তী: {nextPrayer.name} ({nextPrayer.time})
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            {[
              { label: 'ফজর', time: data.prayers.fajr },
              { label: 'যোহর', time: data.prayers.dhuhr },
              { label: 'আসর', time: data.prayers.asr },
              { label: 'এশা', time: data.prayers.isha }
            ].map((w) => (
              <div key={w.label} className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                <span className="block text-[11px] font-bold text-stone-500 dark:text-stone-400">{w.label}</span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{w.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
