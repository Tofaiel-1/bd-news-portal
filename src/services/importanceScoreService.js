/**
 * importanceScoreService.js
 * গুরুত্ব ও সতেজতা-ভিত্তিক সংবাদ র‌্যাঙ্কিং এবং স্কোরিং সার্ভিস।
 * আজকের তাজা এবং উচ্চ-গুরুত্বের সংবাদকে সর্বদা শীর্ষ শোকেসে অগ্রাধিকার দেয়।
 */

export const CATEGORY_IMPORTANCE_WEIGHTS = {
  'জাতীয় ও রাজনীতি': 18,
  'বাণিজ্য ও অর্থনীতি': 16,
  'আইন ও আদালত': 15,
  'আবহাওয়া ও দুর্যোগ': 15,
  'আন্তর্জাতিক ও বিশ্ব': 14,
  'স্বাস্থ্য ও চিকিৎসা': 13,
  'যোগাযোগ ও পরিবহন': 12,
  'কৃষি, প্রকৃতি ও পরিবেশ': 11,
  'শিক্ষা ও ক্যারিয়ার': 10,
  'বিজ্ঞান ও প্রযুক্তি': 9,
  'খেলাধুলা': 8,
  'বিনোদন ও সংস্কৃতি': 8,
  'প্রবাস ও ডায়াসপোরা': 8,
  'ধর্ম ও জীবনযাপন': 7
};

/**
 * একটি সংবাদের গুরুত্ব স্কোর (০-১০০ স্কেলে) হিসাব করে
 */
export function computeImportanceScore(event) {
  if (!event) return 70;

  let score = 20;

  // ১. ক্যাটাগরি গুরুত্ব ওয়েট (সর্বোচ্চ ১৮ পয়েন্ট)
  const normalizedCat = (event.category || '').normalize('NFC');
  const catWeight = CATEGORY_IMPORTANCE_WEIGHTS[normalizedCat] || 10;
  score += catWeight;

  // ২. মূল পোর্টালের ছবির উপস্থিতি (বড় শোকেসে ভিজ্যুয়াল মান নিশ্চিত করতে +১০)
  if (event.image_url) {
    score += 10;
  }

  // ৩. রিয়েল-টাইম লাইভ কভারেজ বোনাস (+১৫ পয়েন্ট)
  if (event.isLiveRealTime) {
    score += 15;
  }

  // ৪. ব্রেকিং স্ট্যাটাস বোনাস (+৮ পয়েন্ট)
  if (event.freshness === 'breaking') {
    score += 8;
  }

  // ৫. রুট টাইমস্ট্যাম্প অনুযায়ী সতেজতা বোনাস (পুরোনো দিনের খবর যাতে আজকের শীর্ষ খবর না দখল করে)
  if (event.published_at) {
    try {
      const pubTime = new Date(event.published_at).getTime();
      if (!isNaN(pubTime)) {
        const diffHours = (Date.now() - pubTime) / (1000 * 60 * 60);
        if (diffHours <= 2) {
          score += 28;
        } else if (diffHours <= 6) {
          score += 22;
        } else if (diffHours <= 12) {
          score += 16;
        } else if (diffHours <= 24) {
          score += 10;
        } else if (diffHours <= 48) {
          score += 2;
        } else {
          score -= 20;
        }
      }
    } catch {
      // ignore
    }
  }

  // ৬. বিশ্বাসযোগ্যতা ও সোর্স গুণমান (+৭ পর্যন্ত)
  const conf = Number(event.confidence) || 85;
  score += (conf * 0.07);

  return Math.min(Math.max(Math.round(score), 55), 99);
}

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
    labelBn: 'আলোচিত',
    tier: 'bronze',
    badgeClass: 'bg-amber-600 text-white border-amber-400',
    pillClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    gradient: 'from-amber-600 to-orange-600',
    textClass: 'text-amber-600 dark:text-amber-400'
  };
}

/**
 * সংবাদ তালিকা থেকে সেরা গুরুত্ব ও সতেজতার N-সংখ্যক সংবাদ বাছাই
 */
export function getTopImportantNews(events, count = 7) {
  if (!Array.isArray(events) || events.length === 0) return [];

  const scoredEvents = events.map(evt => ({
    ...evt,
    importanceScore: computeImportanceScore(evt)
  }));

  // গুরুত্ব স্কোর (এবং সমান হলে প্রকাশিত সময়) অনুসারে সাজানো
  scoredEvents.sort((a, b) => {
    if (b.importanceScore !== a.importanceScore) {
      return b.importanceScore - a.importanceScore;
    }
    return new Date(b.published_at || 0) - new Date(a.published_at || 0);
  });

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
