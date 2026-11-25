/**
 * districtNewsCoverageService.js
 * দিন, মাস ও বছর ভিত্তিক ঐতিহাসিক সংবাদ আর্কাইভ ও ডেটা ম্যানেজমেন্ট সার্ভিস।
 * 
 * মূল বৈশিষ্ট্য:
 * ১. আজকের তাজা খবর (Today) সর্বদা সামনে থাকবে।
 * ২. গতকাল (Yesterday) বা আগের দিনের খবর পেছনের তারিখে সংরক্ষিত থাকবে, সামনে মিশবে না।
 * ৩. দিন, মাস ও বছর ভিত্তিক ফিল্টারিং ও স্পেসিফিক ক্যালেন্ডার ডেট ব্রাউজিং।
 */

import { REAL_MEDIA_NEWS_DATA } from '../data/realMediaNewsData.js';
import { fetchLiveRssNews } from './liveRssService.js';

// দিনভিত্তিক অফসেট ডেট ফরম্যাটার (YYYY-MM-DD)
export const formatDateKey = (dateObj) => {
  if (!dateObj) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// বাংলা সংখ্যা রূপান্তরকারী
const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBanglaDigit = (num) => String(num ?? 0).replace(/[0-9]/g, d => bnDigits[d]);

export const BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// বাংলা তারিখ লেবেল (যেমন: "২০ নভেম্বর ২০২৬")
export const formatBanglaDateLabel = (dateInput) => {
  if (!dateInput) return '';
  let dateObj = dateInput;
  if (typeof dateInput === 'string') {
    // "YYYY-MM-DD" বা "YYYY-MM" নিরাপদ পার্সিং (টাইমজোন বিচ্যুতিহীন)
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else if (parts.length === 2) {
      return `${BANGLA_MONTHS[Number(parts[1]) - 1]} ${toBanglaDigit(parts[0])}`;
    } else {
      return toBanglaDigit(dateInput);
    }
  }

  const day = toBanglaDigit(dateObj.getDate());
  const month = BANGLA_MONTHS[dateObj.getMonth()];
  const year = toBanglaDigit(dateObj.getFullYear());
  return `${day} ${month} ${year}`;
};

// ডাটাবেজের সকল সংবাদের তারিখ অনুযায়ী সুবিন্যস্ত ম্যাপ
export const getArchiveDateCounts = () => {
  const counts = {};
  const todayKey = formatDateKey(new Date());
  REAL_MEDIA_NEWS_DATA.forEach(item => {
    const dKey = item.published_at ? item.published_at.slice(0, 10) : todayKey;
    counts[dKey] = (counts[dKey] || 0) + 1;
  });
  return counts;
};

/**
 * গত ৭-১৪ দিনের তারিখ তালিকা প্রস্তুত করা (দিনভিত্তিক কুইক পিলসের জন্য)
 */
export const getPastDaysList = (daysCount = 7) => {
  const list = [];
  const today = new Date();
  const dateCounts = getArchiveDateCounts();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today.getTime() - (i * 24 * 3600 * 1000));
    const key = formatDateKey(d);
    const dayBn = toBanglaDigit(d.getDate());
    const monthBn = BANGLA_MONTHS[d.getMonth()];

    let label = '';
    if (i === 0) label = `আজ (${dayBn} ${monthBn})`;
    else if (i === 1) label = `গতকাল (${dayBn} ${monthBn})`;
    else label = `${dayBn} ${monthBn}`;

    list.push({
      dateKey: key,
      fullDateLabel: formatBanglaDateLabel(d),
      shortLabel: label,
      isToday: i === 0,
      isYesterday: i === 1,
      dateObj: d,
      count: dateCounts[key] || 0
    });
  }

  return list;
};

/**
 * উপলব্ধ সকল বছর, মাস ও তারিখের তালিকা প্রস্তুত করা (ড্রপডাউন ও অ্যাডভান্সড সার্চের জন্য)
 */
export const getAvailableArchiveSummary = () => {
  const dateCounts = getArchiveDateCounts();
  const sortedDates = Object.keys(dateCounts).sort((a, b) => b.localeCompare(a));

  const yearsSet = new Set();
  const monthsMap = {}; // '2026-11': count

  sortedDates.forEach(d => {
    const [year, month] = d.split('-');
    if (year) yearsSet.add(year);
    if (year && month) {
      const ym = `${year}-${month}`;
      monthsMap[ym] = (monthsMap[ym] || 0) + dateCounts[d];
    }
  });

  return {
    dates: sortedDates,
    years: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
    monthsMap,
    dateCounts,
    totalStories: REAL_MEDIA_NEWS_DATA.length
  };
};

/**
 * দিন, মাস ও বছর ভিত্তিক সুনির্দিষ্ট সংবাদ ফেচার:
 * - আজ (todayKey) নির্বাচন করলে শুধুমাত্র আজকের তাজা খবর + লাইভ আরএসএস দেখাবে (গতকালের খবর সামনে আসবে না)।
 * - কোনো নির্দিষ্ট তারিখ (যেমন: "2026-11-19") নির্বাচন করলে শুধুমাত্র সেই তারিখের খবর দেখাবে।
 * - কোনো নির্দিষ্ট মাস (যেমন: "2026-11") নির্বাচন করলে সেই মাসের সকল খবর দেখাবে।
 * - 'all' নির্বাচন করলে সকল ঐতিহাসিক আর্কাইভ দেখাবে।
 */
export async function getCompleteDistrictNewsCoverage(dateKey = null) {
  const todayKey = formatDateKey(new Date());
  const activeDateKey = dateKey || todayKey;
  const isToday = activeDateKey === todayKey;

  // ১. নির্দিষ্ট তারিখ / মাস / বছর অনুসারে আসল মিডিয়া ডাটাবেজ ফিল্টার
  let filteredBaseline = [];
  if (activeDateKey === 'all') {
    filteredBaseline = REAL_MEDIA_NEWS_DATA.map(evt => ({
      ...evt,
      dateKey: evt.published_at ? evt.published_at.slice(0, 10) : todayKey
    }));
  } else if (activeDateKey.length === 7) {
    // মাসভিত্তিক ফিল্টারিং (যেমন: "2026-11")
    filteredBaseline = REAL_MEDIA_NEWS_DATA
      .filter(evt => {
        const itemDate = evt.published_at ? evt.published_at.slice(0, 7) : todayKey.slice(0, 7);
        return itemDate === activeDateKey;
      })
      .map(evt => ({
        ...evt,
        dateKey: evt.published_at ? evt.published_at.slice(0, 10) : todayKey
      }));
  } else if (activeDateKey.length === 4) {
    // বছরভিত্তিক ফিল্টারিং (যেমন: "2026")
    filteredBaseline = REAL_MEDIA_NEWS_DATA
      .filter(evt => {
        const itemDate = evt.published_at ? evt.published_at.slice(0, 4) : todayKey.slice(0, 4);
        return itemDate === activeDateKey;
      })
      .map(evt => ({
        ...evt,
        dateKey: evt.published_at ? evt.published_at.slice(0, 10) : todayKey
      }));
  } else {
    // সুনির্দিষ্ট দিনভিত্তিক ফিল্টারিং (যেমন: "2026-11-20" অথবা "2026-11-23")
    filteredBaseline = REAL_MEDIA_NEWS_DATA
      .filter(evt => {
        const itemDate = evt.published_at ? evt.published_at.slice(0, 10) : todayKey;
        return itemDate === activeDateKey;
      })
      .map(evt => ({
        ...evt,
        dateKey: activeDateKey
      }));

    // লাইভ পোর্টাল না চললে বা অফলাইন অবস্থায় কেবল ব্যাকআপ সংবাদ দেখাবে;
    // রিয়েল-টাইম লাইভ সংবাদ থাকলে পুরোনো দিনের আর্কাইভকে আজকের তারিখ হিসেবে মিশ্রিত করা হবে না
  }

  // ২. যদি আজকের তারিখ হয়, তবে লাইভ আরএসএস/এপিআই থেকে তাজা সংবাদ ফেচ
  let liveRss = [];
  if (isToday) {
    try {
      liveRss = await fetchLiveRssNews();
    } catch (e) {
      console.warn('Live RSS integration in coverage service:', e);
    }

    // লাইভ এপিআই ব্যর্থ হলে বা খুবই কম আইটেম (< ১২) থাকলে ব্যাকআপ বেসলাইন ব্যবহার
    if (filteredBaseline.length === 0 && liveRss.length < 12) {
      filteredBaseline = REAL_MEDIA_NEWS_DATA.slice(0, 60).map(evt => ({
        ...evt,
        dateKey: evt.published_at ? evt.published_at.slice(0, 10) : todayKey
      }));
    }
  }

  // ৩. ডুপ্লিকেট রিমুভ করে লাইভ নিউজকে শীর্ষে রাখা
  const allEvents = [...liveRss, ...filteredBaseline];
  const uniqueEvents = [];
  const seenTitles = new Set();

  allEvents.forEach(evt => {
    if (evt && evt.canonical_bangla_title && !seenTitles.has(evt.canonical_bangla_title)) {
      seenTitles.add(evt.canonical_bangla_title);
      uniqueEvents.push(evt);
    }
  });

  // সময় অনুযায়ী নতুন থেকে পুরোনো ক্রমে সাজানো
  uniqueEvents.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

  return uniqueEvents;
}
