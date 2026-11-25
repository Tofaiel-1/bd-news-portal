/**
 * src/utils/dateUtils.js
 * বাংলাদেশের জাতীয় ও স্থানীয় সংবাদ পোর্টালের রুট টাইমস্ট্যাম্প থেকে
 * শতভাগ নির্ভুল ও আপেক্ষিক সময় হিসাবকারী কেন্দ্রীয় ইঞ্জিন।
 */

export const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const BANGLA_WEEKDAYS = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

/**
 * ইংরেজি সংখ্যা থেকে বাংলা সংখ্যায় রূপান্তর
 */
export function toBanglaNumber(num) {
  if (num === null || num === undefined) return '০';
  return String(num).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[Number(digit)] || digit);
}

/**
 * মূল সংবাদ পোর্টালের প্রকাশিত সময়কে (Root Timestamp) ভিত্তি ধরে
 * বর্তমান সময়ের সাপেক্ষে প্রকৃত অতিবাহিত সময় (Relative Time Ago) গণনা।
 */
export function getAccurateTimeAgo(publishedAt, fallbackLabel = 'তাজা') {
  if (!publishedAt) return fallbackLabel;

  try {
    const pubTime = new Date(publishedAt).getTime();
    if (isNaN(pubTime)) return fallbackLabel;

    const now = Date.now();
    const diffMs = now - pubTime;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 1) {
      return 'এইমাত্র';
    }
    if (diffMinutes < 60) {
      return `${toBanglaNumber(diffMinutes)} মিনিট আগে`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    const remMinutes = diffMinutes % 60;
    if (diffHours < 24) {
      if (diffHours < 4 && remMinutes > 0) {
        return `${toBanglaNumber(diffHours)} ঘণ্টা ${toBanglaNumber(remMinutes)} মিনিট আগে`;
      }
      return `${toBanglaNumber(diffHours)} ঘণ্টা আগে`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return '১ দিন আগে';
    }
    if (diffDays < 7) {
      return `${toBanglaNumber(diffDays)} দিন আগে`;
    }

    const d = new Date(pubTime);
    const day = toBanglaNumber(d.getDate());
    const month = BANGLA_MONTHS[d.getMonth()] || '';
    const year = toBanglaNumber(d.getFullYear());
    return `${day} ${month} ${year}`;
  } catch {
    return fallbackLabel;
  }
}

/**
 * মূল পোর্টালের সুনির্দিষ্ট তারিখ ও সময় (যেমন: "২৫ নভেম্বর ২০২৬, সকাল ০৬:৩৪")
 */
export function formatExactBanglaDateTime(publishedAt) {
  if (!publishedAt) return '';
  try {
    const d = new Date(publishedAt);
    if (isNaN(d.getTime())) return '';

    // বাংলাদেশ সময় (Asia/Dhaka) হিসেবে ফরম্যাট
    const bdDateStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    const bd = new Date(bdDateStr);

    const day = toBanglaNumber(bd.getDate());
    const month = BANGLA_MONTHS[bd.getMonth()] || '';
    const year = toBanglaNumber(bd.getFullYear());

    const hrs24 = bd.getHours();
    const mins = String(bd.getMinutes()).padStart(2, '0');
    const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;

    let period = 'রাত';
    if (hrs24 >= 4 && hrs24 < 6) period = 'ভোর';
    else if (hrs24 >= 6 && hrs24 < 12) period = 'সকাল';
    else if (hrs24 >= 12 && hrs24 < 15) period = 'দুপুর';
    else if (hrs24 >= 15 && hrs24 < 18) period = 'বিকেল';
    else if (hrs24 >= 18 && hrs24 < 20) period = 'সন্ধ্যা';

    return `${day} ${month} ${year}, ${period} ${toBanglaNumber(hrs12)}:${toBanglaNumber(mins)}`;
  } catch {
    return '';
  }
}

/**
 * আজকের পূর্ণাঙ্গ বাংলা তারিখ (যেমন: "বুধবার, ২৫ নভেম্বর ২০২৬")
 */
export function getBanglaTodayDateString(dateObj = new Date()) {
  try {
    const bdStr = dateObj.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    const bd = new Date(bdStr);
    const weekday = BANGLA_WEEKDAYS[bd.getDay()] || '';
    const day = toBanglaNumber(bd.getDate());
    const month = BANGLA_MONTHS[bd.getMonth()] || '';
    const year = toBanglaNumber(bd.getFullYear());
    return `${weekday}, ${day} ${month} ${year}`;
  } catch {
    return '';
  }
}

/**
 * তারিখকে YYYY-MM-DD ফরম্যাটে আনা
 */
export function formatDateKey(dateObj) {
  if (!dateObj) return '';
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
