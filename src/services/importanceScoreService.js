/**
 * importanceScoreService.js
 * গুরুত্বভিত্তিক সংবাদ র‌্যাঙ্কিং এবং স্কোরিং সার্ভিস।
 * কৃত্রিম বুদ্ধিমত্তার সীমাবদ্ধতা এড়িয়ে সম্পূর্ণ নিখুঁত গাণিতিক অ্যালগরিদমে 
 * প্রতিটি সংবাদের গুরুত্ব (Importance Score: ০-১০০) নির্ধারণ করে।
 */

export const CATEGORY_IMPORTANCE_WEIGHTS = {
  'জাতীয় রাজনীতি ও প্রশাসন': 18,
  'অর্থনীতি ও বাণিজ্য': 16,
  'আইন-আদালত ও অপরাধ': 15,
  'দুর্যোগ ও আবহাওয়া': 15,
  'আন্তর্জাতিক ও বিশ্ব': 14,
  'স্বাস্থ্য ও চিকিৎসা': 13,
  'যোগাযোগ ও পরিবহন': 12,
  'কৃষি ও পরিবেশ': 11,
  'শিক্ষা ও চাকরি': 10,
  'প্রযুক্তি ও উদ্ভাবন': 9,
  'খেলাধুলা ও বিনোদন': 8,
  'লাইফস্টাইল ও ধর্ম': 7
};

/**
 * একটি সংবাদের গুরুত্ব স্কোর (০-১০০ স্কেলে) হিসাব করে
 * @param {Object} event - সংবাদ অবজেক্ট
 * @returns {number} - ০ থেকে ১০০ এর মধ্যে পূর্ণসংখ্যা স্কোর
 */
export function computeImportanceScore(event) {
  if (!event) return 70;

  // বেস ফাউন্ডেশন পয়েন্ট: ১৫
  let score = 15;

  // ১. সত্যতা যাচাইয়ের মাত্রা / কনফিডেন্স স্কোর (সর্বোচ্চ ৩০ পয়েন্ট)
  const conf = Number(event.confidence) || 80;
  score += (conf * 0.30); // 80 -> 24, 99 -> 29.7

  // ২. স্বাধীন গণমাধ্যম উৎসের সংখ্যা (সর্বোচ্চ ২০ পয়েন্ট)
  const sourceCount = Number(event.independence?.independent_source_count) || 1;
  score += Math.min(sourceCount * 6.5, 20);

  // ৩. ব্রেকিং নিউজ স্ট্যাটাস বোনাস (১০ পয়েন্ট)
  if (event.freshness === 'breaking') {
    score += 10;
  }

  // ৪. অফিসিয়ালি নিশ্চিত / ভেরিফিকেশন স্ট্যাটাস বোনাস (১০ পয়েন্ট)
  if (event.status === 'officially_confirmed') {
    score += 10;
  } else if (event.status === 'multi_source_match') {
    score += 7;
  } else if (event.status === 'conflicting_reports') {
    score += 5; // অমিল থাকলেও এটি অত্যন্ত আলোচিত
  }

  // ৫. ক্যাটাগরি গুরুত্ব ওয়েট (সর্বোচ্চ ১৮ পয়েন্ট)
  const catWeight = CATEGORY_IMPORTANCE_WEIGHTS[event.category] || 10;
  score += catWeight;

  // ৬. রিয়েল-টাইম লাইভ কভারেজ বোনাস (৫ পয়েন্ট)
  if (event.isLiveRealTime) {
    score += 5;
  }

  // ৭. সতেজতা ও সময়ের ব্যালেন্সিং
  if (event.published_at) {
    try {
      const pubTime = new Date(event.published_at).getTime();
      const now = Date.now();
      const diffHours = (now - pubTime) / (1000 * 60 * 60);

      if (diffHours <= 6) {
        score += 4; // অতি তাজা খবর
      } else if (diffHours <= 12) {
        score += 2;
      }
    } catch {
      // ডেট পার্সিং নো-অপ
    }
  }

  // স্কোরকে সর্বনিম্ন ৬০ এবং সর্বোচ্চ ৯৯-এর মধ্যে সীমাবদ্ধ রাখা
  const finalScore = Math.min(Math.max(Math.round(score), 60), 99);
  return finalScore;
}

/**
 * গুরুত্ব স্কোরের লেবেল ও থিম কালার রিটার্ন করে
 * @param {number} score
 */
export function getImportanceBadge(score) {
  if (score >= 95) {
    return {
      labelBn: 'সর্বোচ্চ গুরুত্বপূর্ণ',
      tier: 'platinum',
      badgeClass: 'bg-rose-600 text-white border-rose-400',
      pillClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
      gradient: 'from-rose-600 to-red-600',
      textClass: 'text-rose-600 dark:text-rose-400'
    };
  }
  if (score >= 88) {
    return {
      labelBn: 'অত্যন্ত গুরুত্বপূর্ণ',
      tier: 'gold',
      badgeClass: 'bg-emerald-600 text-white border-emerald-400',
      pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
      gradient: 'from-emerald-600 to-teal-600',
      textClass: 'text-emerald-600 dark:text-emerald-400'
    };
  }
  if (score >= 80) {
    return {
      labelBn: 'বিশেষ গুরুত্বপূর্ণ',
      tier: 'silver',
      badgeClass: 'bg-sky-600 text-white border-sky-400',
      pillClass: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
      gradient: 'from-sky-600 to-blue-600',
      textClass: 'text-sky-600 dark:text-sky-400'
    };
  }
  return {
    labelBn: 'নজরে রাখুন',
    tier: 'bronze',
    badgeClass: 'bg-amber-600 text-white border-amber-400',
    pillClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    gradient: 'from-amber-600 to-orange-600',
    textClass: 'text-amber-600 dark:text-amber-400'
  };
}

/**
 * সংবাদ তালিকা থেকে সেরা গুরুত্বের N-সংখ্যক সংবাদ বাছাই
 * @param {Array} events - সকল সংবাদ ইভেন্ট
 * @param {number} count - কতটি টপ নিউজ প্রয়োজন (ডিফল্ট: ৭টি)
 * @returns {Array} - স্কোরে সাজানো টপ নিউজ তালিকা
 */
export function getTopImportantNews(events, count = 7) {
  if (!Array.isArray(events) || events.length === 0) return [];

  // ১. প্রতিটি সংবাদের গুরুত্ব স্কোর নির্ধারণ
  const scoredEvents = events.map(evt => ({
    ...evt,
    importanceScore: computeImportanceScore(evt)
  }));

  // ২. গুরুত্ব স্কোর অনুসারে বড় থেকে ছোট ক্রমানুসারে সাজানো
  scoredEvents.sort((a, b) => b.importanceScore - a.importanceScore);

  // ৩. ডুপ্লিকেট শিরোনাম দূর করে অনন্য সংবাদ বাছাই
  const uniqueTop = [];
  const seenTitles = new Set();

  for (const item of scoredEvents) {
    if (!seenTitles.has(item.canonical_bangla_title)) {
      seenTitles.add(item.canonical_bangla_title);
      uniqueTop.push(item);
      if (uniqueTop.length >= count) break;
    }
  }

  return uniqueTop;
}
