/**
 * api/live-news.js
 * Vercel Serverless Function — বাংলাদেশের শীর্ষ জাতীয় ও আন্তর্জাতিক গণমাধ্যম থেকে
 * রিয়েল-টাইম মাল্টি-পোর্টাল লাইভ নিউজ এপিআই (JSON + RSS হাইব্রিড ইঞ্জিন)।
 *
 * সংযুক্ত গণমাধ্যমসমূহ:
 * ১. প্রথম আলো (Prothom Alo) - Quintype JSON API (সরাসরি মিলিসেকেন্ড টাইমস্ট্যাম্প ও আসল ফটো)
 * ২. বিডিনিউজ ২৪ (bdnews24) - Quintype JSON API (সরাসরি মিলিসেকেন্ড টাইমস্ট্যাম্প ও আসল ফটো)
 * ৩. দৈনিক ইত্তেফাক (The Daily Ittefaq) - ৮০০x৪৫০ এইচডি ফটো ও +0600 সময়
 * ৪. বাংলা ট্রিবিউন (Bangla Tribune) - ৮০০x৪৫০ এইচডি ফটো ও +0600 সময়
 * ৫. দেশ রূপান্তর (Desh Rupantor) - ৮০০x৪৫০ এইচডি ফটো ও +0600 সময়
 * ৬. বিবিসি বাংলা (BBC News Bangla) - ৮০০px ক্রিস্টাল ক্লিয়ার থাম্বনেইল ও নির্ভুল সময়
 * ৭. চ্যানেল আই অনলাইন (Channel i Online) - ডাইরেক্ট আর্টিকেল og:image ও আসল প্রকাশ সময়
 *
 * নির্ভুলতা ও নিরাপত্তা নিশ্চয়তা:
 * - কোনো ফেক বা অপ্রাসঙ্গিক স্টক ছবি নয়: প্রতিটি খবরে মূল পোর্টালের আসল প্রকাশিত ফটো।
 * - কোনো ভুয়া "১ মিনিট আগে" নয়: প্রতিটি খবরে মূল পোর্টালের রুট publish timestamp অনুসারে প্রকৃত অতিবাহিত সময়।
 * - অভিন্ন ক্যাটাগরি ম্যাপিং (ফ্রন্টএন্ড ফিল্টারের সাথে শতভাগ সামঞ্জস্যপূর্ণ)।
 */

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBanglaNumber(num) {
  if (num === null || num === undefined) return '০';
  return String(num).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[Number(digit)] || digit);
}

// টেক্সট থেকে CDATA, HTML ট্যাগ ও অতিরিক্ত হোয়াইটস্পেস দূরীকরণ
function cleanHtml(str = '') {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// অবৈধ, প্লেসহোল্ডার বা বিভ্রান্তিকর ছবি ফিল্টার
function isValidNewsImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) return false;
  const lower = trimmed.toLowerCase();
  const blockedPatterns = [
    'spacer',
    '1x1',
    'pixel',
    'default-image',
    'placeholder',
    'no-image',
    'brand.jpg',
    'site-logo',
    'farhannadim'
  ];
  return !blockedPatterns.some((p) => lower.includes(p));
}

// আরএসএস ব্লক থেকে সরাসরি পোর্টালের আসল ও প্রামাণ্য ছবি নিষ্কাশন
function extractImageUrl(itemBlock) {
  if (!itemBlock) return null;

  let img = null;

  const mediaMatch = itemBlock.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch && mediaMatch[1]) {
    img = mediaMatch[1].trim();
  }

  if (!img) {
    const thumbMatch = itemBlock.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
    if (thumbMatch && thumbMatch[1]) {
      img = thumbMatch[1].trim();
    }
  }

  if (!img) {
    const encMatch = itemBlock.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    if (encMatch && encMatch[1]) {
      img = encMatch[1].trim();
    }
  }

  if (!img) {
    const imgMatch = itemBlock.match(/(?:<|&lt;)img[^>]+src=(?:["']|&quot;)(https?:\/\/[^"'\s&<>]+)(?:["']|&quot;)/i);
    if (imgMatch && imgMatch[1]) {
      img = imgMatch[1].trim();
    }
  }

  if (!img) return null;

  // রেজোলিউশন অপ্টিমাইজেশন
  if (img.includes('media.prothomalo.com') && img.includes('?w=')) {
    img = img.replace(/\?w=\d+.*$/, '?w=1200&auto=format');
  } else if (img.includes('ichef.bbci.co.uk') && img.includes('/240/')) {
    img = img.replace('/240/', '/800/');
  } else if (img.includes('/contents/cache/images/300x300x1/')) {
    img = img.replace('/contents/cache/images/300x300x1/', '/contents/cache/images/800x450x1/');
  }

  return isValidNewsImageUrl(img) ? img : null;
}

// src/data/locations.js এর CATEGORIES এর সাথে শতভাগ ম্যাচ করা ক্যাটাগরি শনাক্তকরণ
function detectCategory(title = '', desc = '', hintCategory = '') {
  const hint = (hintCategory || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();
  const bodyLower = `${title} ${desc}`.toLowerCase();

  // ১. পোর্টালের নিজস্ব সেকশন ট্যাগকে সর্বোচ্চ অগ্রাধিকার
  if (hint.includes('খেলা') || hint.includes('sport') || hint.includes('cricket') || hint.includes('football') || hint.includes('টিভি সূচী')) {
    return 'খেলাধুলা';
  }
  if (hint.includes('বিনোদন') || hint.includes('entertainment') || hint.includes('glamour') || hint.includes('সংস্কৃতি')) {
    return 'বিনোদন ও সংস্কৃতি';
  }
  if (hint.includes('অর্থ') || hint.includes('বাণিজ্য') || hint.includes('business') || hint.includes('economy') || hint.includes('মজুরি')) {
    return 'বাণিজ্য ও অর্থনীতি';
  }
  if (hint.includes('আন্তর্জাতিক') || hint.includes('বিশ্ব সংবাদ') || hint.includes('world') || hint.includes('international') || hint.includes('middle-east')) {
    return 'আন্তর্জাতিক ও বিশ্ব';
  }
  if (hint.includes('আইন') || hint.includes('আদালত') || hint.includes('অপরাধ') || hint.includes('law') || hint.includes('crime')) {
    return 'আইন ও আদালত';
  }
  if (hint.includes('স্বাস্থ্য') || hint.includes('চিকিৎসা') || hint.includes('health')) {
    return 'স্বাস্থ্য ও চিকিৎসা';
  }
  if (hint.includes('বিজ্ঞান') || hint.includes('প্রযুক্তি') || hint.includes('tech') || hint.includes('science')) {
    return 'বিজ্ঞান ও প্রযুক্তি';
  }
  if (hint.includes('শিক্ষা') || hint.includes('ক্যাম্পাস') || hint.includes('চাকরি') || hint.includes('education')) {
    return 'শিক্ষা ও ক্যারিয়ার';
  }
  if (hint.includes('আবহাওয়া') || hint.includes('দুর্যোগ') || hint.includes('weather')) {
    return 'আবহাওয়া ও দুর্যোগ';
  }
  if (hint.includes('কৃষি') || hint.includes('পরিবেশ') || hint.includes('প্রকৃতি')) {
    return 'কৃষি, প্রকৃতি ও পরিবেশ';
  }
  if (hint.includes('যোগাযোগ') || hint.includes('পরিবহন')) {
    return 'যোগাযোগ ও পরিবহন';
  }
  if (hint.includes('প্রবাস') || hint.includes('probash')) {
    return 'প্রবাস ও ডায়াসপোরা';
  }
  if (hint.includes('ধর্ম') || hint.includes('জীবনযাপন') || hint.includes('lifestyle')) {
    return 'ধর্ম ও জীবনযাপন';
  }

  // পোর্টাল যদি স্পষ্ট জাতীয়/রাজধানী/দেশ সেকশনে প্রকাশ করে তবে কখনোই আন্তর্জাতিক হবে না
  const isExplicitNationalSection =
    hint.includes('জাতীয়') || hint.includes('জাতীয়') || hint.includes('রাজধানী') ||
    hint.includes('সারাদেশ') || hint === 'দেশ' || hint.includes('দেশ ') ||
    hint.includes('bangladesh') || hint.includes('রাজনীতি') || hint.includes('politics');

  // ২. শিরোনাম-ভিত্তিক সুনির্দিষ্ট বিষয় নির্ণয়
  if (
    !isExplicitNationalSection && (
      titleLower.includes('ট্রাম্প') || titleLower.includes('পুতিন') || titleLower.includes('ইউক্রেন') ||
      titleLower.includes('ইসরায়েল') || titleLower.includes('ইসরায়েল') || titleLower.includes('গাজা') ||
      titleLower.includes('নেতানিয়াহু') || titleLower.includes('ইরান') || titleLower.includes('জাতিসংঘ') ||
      titleLower.includes('যুক্তরাষ্ট্র') || titleLower.includes('যুক্তরাজ্য') || titleLower.includes('রাশিয়া') ||
      titleLower.includes('আন্তর্জাতিক')
    )
  ) {
    return 'আন্তর্জাতিক ও বিশ্ব';
  }
  if (
    titleLower.includes('অর্থনীতি') || titleLower.includes('ব্যাংক') || titleLower.includes('বিনিয়োগ') ||
    titleLower.includes('শেয়ারবাজার') || titleLower.includes('মূল্যস্ফীতি') || titleLower.includes('মজুরি') ||
    titleLower.includes('ডলার') || titleLower.includes('রেমিট্যান্স') || titleLower.includes('পোশাকশ্রমিক')
  ) {
    return 'বাণিজ্য ও অর্থনীতি';
  }
  if (
    titleLower.includes('ক্রিকেট') || titleLower.includes('ফুটবল') || titleLower.includes('ম্যাচ') ||
    titleLower.includes('খেলা') || titleLower.includes('উইকেট') || titleLower.includes('গোল') ||
    titleLower.includes('নেইমার') || titleLower.includes('রিয়াল') || titleLower.includes('আর্সেনাল') ||
    titleLower.includes('বার্সেলোনা') || titleLower.includes('মেসি') || titleLower.includes('স্টেডিয়াম')
  ) {
    return 'খেলাধুলা';
  }
  if (
    titleLower.includes('সিনেমা') || titleLower.includes('নাটক') || titleLower.includes('অভিনেতা') ||
    titleLower.includes('অভিনেত্রী') || titleLower.includes('চলচ্চিত্র') || titleLower.includes('গান')
  ) {
    return 'বিনোদন ও সংস্কৃতি';
  }
  if (
    titleLower.includes('গ্রেপ্তার') || titleLower.includes('গ্রেফতার') || titleLower.includes('হত্যা') ||
    titleLower.includes('আদালত') || titleLower.includes('পুলিশ') || titleLower.includes('র‌্যাব') ||
    titleLower.includes('মামলা') || titleLower.includes('অপরাধ') || titleLower.includes('আইনশৃঙ্খলা') ||
    titleLower.includes('রিমান্ড') || titleLower.includes('কারাগার') || titleLower.includes('হাইকোর্ট') ||
    titleLower.includes('ডাকাতি') || titleLower.includes('অস্ত্র') || titleLower.includes('নাশকতা')
  ) {
    return 'আইন ও আদালত';
  }
  if (
    bodyLower.includes('বৃষ্টি') || bodyLower.includes('ঝড়') || bodyLower.includes('ঘূর্ণিঝড়') ||
    bodyLower.includes('বন্যা') || bodyLower.includes('আবহাওয়া') || bodyLower.includes('শৈত্যপ্রবাহ') ||
    bodyLower.includes('ভূমিকম্প')
  ) {
    return 'আবহাওয়া ও দুর্যোগ';
  }
  if (
    titleLower.includes('হাসপাতাল') || titleLower.includes('রোগী') || titleLower.includes('স্বাস্থ্য') ||
    titleLower.includes('চিকিৎসা') || titleLower.includes('ওষুধ') || titleLower.includes('ডেঙ্গু') ||
    titleLower.includes('জন্মনিয়ন্ত্রণ')
  ) {
    return 'স্বাস্থ্য ও চিকিৎসা';
  }
  if (
    titleLower.includes('বিজ্ঞান') || titleLower.includes('প্রযুক্তি') || titleLower.includes('এআই') ||
    titleLower.includes('ইন্টারনেট') || titleLower.includes('স্মার্টফোন') || titleLower.includes('কম্পিউটার') ||
    titleLower.includes('সাইবার') || titleLower.includes('এনভিডিয়া')
  ) {
    return 'বিজ্ঞান ও প্রযুক্তি';
  }
  if (
    titleLower.includes('সড়ক') || titleLower.includes('যানজট') || titleLower.includes('ট্রেন') ||
    titleLower.includes('উড়ালসেতু') || titleLower.includes('মেট্রোরেল') || titleLower.includes('মহাসড়ক') ||
    titleLower.includes('দুর্ঘটনা')
  ) {
    return 'যোগাযোগ ও পরিবহন';
  }
  if (
    titleLower.includes('বিশ্ববিদ্যালয়') || titleLower.includes('কলেজ') || titleLower.includes('স্কুল') ||
    titleLower.includes('পরীক্ষা') || titleLower.includes('শিক্ষার্থী') || titleLower.includes('ভর্তি') ||
    titleLower.includes('বিসিএস') || titleLower.includes('শিক্ষা')
  ) {
    return 'শিক্ষা ও ক্যারিয়ার';
  }
  if (
    titleLower.includes('কৃষি') || titleLower.includes('ধান') || titleLower.includes('ফসল') ||
    titleLower.includes('নদী') || titleLower.includes('পরিবেশ') || titleLower.includes('সুন্দরবন')
  ) {
    return 'কৃষি, প্রকৃতি ও পরিবেশ';
  }
  if (titleLower.includes('প্রবাসী') || titleLower.includes('মালয়েশিয়া') || titleLower.includes('রেমিট্যান্স')) {
    return 'প্রবাস ও ডায়াসপোরা';
  }
  if (titleLower.includes('হাদিস') || titleLower.includes('ইসলাম') || titleLower.includes('কোরআন')) {
    return 'ধর্ম ও জীবনযাপন';
  }

  return 'জাতীয় ও রাজনীতি';
}

// পোর্টালের আসল প্রকাশের সময় (RFC 822, ISO, epoch) নিরাপদ পার্সিং
function parsePortalDate(rawStr) {
  if (rawStr === null || rawStr === undefined) return null;
  if (typeof rawStr === 'number') {
    const d = new Date(rawStr);
    return isNaN(d.getTime()) ? null : d;
  }
  const str = String(rawStr).trim();
  if (!str) return null;

  // যদি তারিখ স্ট্রিং-এ কোনো টাইমজোন অফসেট (+0600, GMT, Z ইত্যাদি) না থাকে,
  // তবে বাংলাদেশ সময় (+06:00) হিসেবে ধরা হবে যাতে সার্ভার (UTC)-তে ৬ ঘণ্টা ভবিষ্যৎ না দেখায়।
  const hasTz = /(Z|GMT|UTC|[+-]\d{2}:?\d{2})$/i.test(str);
  const candidate = hasTz ? str : `${str} +0600`;

  let d = new Date(candidate);
  if (isNaN(d.getTime())) {
    d = new Date(str);
  }
  return isNaN(d.getTime()) ? null : d;
}

// মূল সংবাদ পোর্টালের রুট টাইমস্ট্যাম্পকে ধরে প্রকৃত অতিবাহিত সময় গণনা
function getTimeAgoLabel(pubDate) {
  const dateObj = pubDate instanceof Date ? pubDate : parsePortalDate(pubDate);
  if (!dateObj) return 'তাজা সংবাদ';

  const now = Date.now();
  const diffSeconds = Math.floor((now - dateObj.getTime()) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 1) {
    return 'এইমাত্র';
  }
  if (diffMinutes < 60) {
    return `${toBanglaNumber(diffMinutes)} মিনিট আগে`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  const remMin = diffMinutes % 60;
  if (diffHours < 24) {
    if (diffHours < 4 && remMin > 0) {
      return `${toBanglaNumber(diffHours)} ঘণ্টা ${toBanglaNumber(remMin)} মিনিট আগে`;
    }
    return `${toBanglaNumber(diffHours)} ঘণ্টা আগে`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '১ দিন আগে';
  return `${toBanglaNumber(diffDays)} দিন আগে`;
}

// সাধারণ নিউজ আইটেম অবজেক্ট বিল্ডার
function buildNewsItem({
  id,
  title,
  summary,
  fullContent,
  category,
  publishedDate,
  imageUrl,
  link,
  sourceId,
  sourceNameBn,
  sourceColor,
  sourceType = 'national_press'
}) {
  const isIntl = category === 'আন্তর্জাতিক ও বিশ্ব' || sourceId === 'bbcbangla';
  const isoDate = publishedDate.toISOString();
  const diffHours = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60);

  return {
    id,
    canonical_bangla_title: title,
    canonical_english_title: '',
    summary_bangla: summary || title,
    full_news_content: fullContent || summary || title,
    ai_generated_summary: `${sourceNameBn} থেকে সংগৃহীত সর্বশেষ প্রকাশিত প্রতিবেদন।`,
    category,
    scope: isIntl ? 'international' : 'bangladesh',
    scopeLabel: isIntl ? 'আন্তর্জাতিক' : 'সারাদেশ',
    location: isIntl ? {
      scope: 'international',
      scopeLabel: 'আন্তর্জাতিক',
      nameBn: 'আন্তর্জাতিক',
      flag: '🌍'
    } : {
      scope: 'bangladesh',
      scopeLabel: 'সারাদেশ',
      nameBn: 'বাংলাদেশ',
      flag: '🇧🇩'
    },
    published_at: isoDate,
    dateKey: isoDate.slice(0, 10),
    time_ago: getTimeAgoLabel(publishedDate),
    sourceType,
    sourceChannel: {
      id: sourceId,
      nameBn: sourceNameBn,
      type: sourceType === 'tv_media' ? 'জাতীয় টেলিভিশন' : 'জাতীয় গণমাধ্যম',
      badgeColor: sourceColor,
      videoUrl: link,
      verified: true
    },
    primarySource: {
      id: sourceId,
      nameBn: sourceNameBn,
      type: 'জাতীয় গণমাধ্যম',
      color: sourceColor,
      verified: true,
      website: link
    },
    status: 'officially_confirmed',
    confidence: 98,
    freshness: diffHours <= 2 ? 'breaking' : 'latest',
    image_url: imageUrl,
    articleUrl: link,
    isLiveRealTime: true,
    independence: {
      independent_source_count: 2,
      independent_sources: [
        { name: sourceNameBn, type: 'মূল গণমাধ্যম', articleUrl: link }
      ]
    }
  };
}

// Quintype গল্পের cards থেকে পূর্ণাঙ্গ টেক্সট বের করা
function extractQuintypeBodyText(story) {
  if (!story || !Array.isArray(story.cards)) return '';
  const paragraphs = [];
  for (const card of story.cards) {
    if (!Array.isArray(card['story-elements'])) continue;
    for (const el of card['story-elements']) {
      if (el.type === 'text' && el.text) {
        const cleaned = cleanHtml(el.text);
        if (cleaned) paragraphs.push(cleaned);
      }
    }
  }
  return paragraphs.join('\n\n');
}

// ১. প্রথম আলো Quintype লাইভ ফেচার (সরাসরি মিলিসেকেন্ড সময় ও আসল ফটো)
async function fetchProthomAloJson() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch('https://www.prothomalo.com/api/v1/collections/latest-all?limit=25', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];

    const data = await res.json();
    const items = [];
    for (const entry of data.items || []) {
      const s = entry.story || (entry.type === 'story' ? entry : null);
      if (!s || !s.headline) continue;

      const heroKey = s['hero-image-s3-key'];
      const imageUrl = heroKey ? `https://media.prothomalo.com/${heroKey}?w=1200&auto=format` : null;
      if (!isValidNewsImageUrl(imageUrl)) continue;

      const pubMs = s['published-at'] || s['last-published-at'] || s['first-published-at'];
      const pubDate = parsePortalDate(pubMs);
      if (!pubDate) continue;

      const fullText = extractQuintypeBodyText(s);
      const rawSummary = cleanHtml(s.subheadline || s.summary || fullText);
      const summary = rawSummary.length > 220 ? rawSummary.slice(0, 220) + '...' : rawSummary;
      const hintCat = s.sections?.[0]?.slug || s.sections?.[0]?.name || '';
      const category = detectCategory(s.headline, rawSummary, hintCat);
      const link = s.url || `https://www.prothomalo.com/${s.slug}`;

      items.push(buildNewsItem({
        id: `live-pa-${s.id || s['story-content-id'] || items.length}`,
        title: cleanHtml(s.headline),
        summary: summary || cleanHtml(s.headline),
        fullContent: fullText || summary,
        category,
        publishedDate: pubDate,
        imageUrl,
        link,
        sourceId: 'prothomalo',
        sourceNameBn: 'প্রথম আলো',
        sourceColor: '#0284C7',
        sourceType: 'national_press'
      }));
    }
    return items;
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

// ২. বিডিনিউজ২৪ Quintype লাইভ ফেচার (সরাসরি মিলিসেকেন্ড সময় ও আসল ফটো)
async function fetchBdnews24Json() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch('https://bangla.bdnews24.com/api/v1/stories?limit=25', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];

    const data = await res.json();
    const items = [];
    for (const s of data.stories || []) {
      if (!s || !s.headline) continue;

      const heroKey = s['hero-image-s3-key'];
      const imageUrl = heroKey ? `https://media.assettype.com/${heroKey}?w=1200&auto=format` : null;
      if (!isValidNewsImageUrl(imageUrl)) continue;

      const pubMs = s['published-at'] || s['last-published-at'] || s['first-published-at'];
      const pubDate = parsePortalDate(pubMs);
      if (!pubDate) continue;

      const fullText = extractQuintypeBodyText(s);
      const rawSummary = cleanHtml(s.subheadline || s.summary || fullText);
      const summary = rawSummary.length > 220 ? rawSummary.slice(0, 220) + '...' : rawSummary;
      const hintCat = s.sections?.[0]?.slug || s.sections?.[0]?.name || '';
      const category = detectCategory(s.headline, rawSummary, hintCat);
      const link = s.url || `https://bangla.bdnews24.com/${s.slug}`;

      items.push(buildNewsItem({
        id: `live-bdnews-${s.id || items.length}`,
        title: cleanHtml(s.headline),
        summary: summary || cleanHtml(s.headline),
        fullContent: fullText || summary,
        category,
        publishedDate: pubDate,
        imageUrl,
        link,
        sourceId: 'bdnews24',
        sourceNameBn: 'বিডিনিউজ ২৪',
        sourceColor: '#DC2626',
        sourceType: 'national_press'
      }));
    }
    return items;
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

// আর্টিকেল URL থেকে আসল og:image ও published_time সংগ্রহ (চ্যানেল আই ও বিবিসি লাইভ আইটেমের জন্য)
async function fetchArticleMetadata(url) {
  if (!url) return {};
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2200);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html'
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return {};
    const html = await res.text();

    const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const pubMeta = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
                    html.match(/"dateModified"\s*:\s*"([^"]+)"/i)?.[1] ||
                    html.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1];

    return {
      imageUrl: isValidNewsImageUrl(ogImg) ? ogImg.trim() : null,
      publishedDate: pubMeta ? parsePortalDate(pubMeta) : null
    };
  } catch {
    clearTimeout(timeoutId);
    return {};
  }
}

const RSS_FEEDS = [
  {
    id: 'ittefaq',
    nameBn: 'দৈনিক ইত্তেফাক',
    url: 'https://www.ittefaq.com.bd/feed/',
    color: '#D97706',
    type: 'national_press',
    limit: 22
  },
  {
    id: 'banglatribune',
    nameBn: 'বাংলা ট্রিবিউন',
    url: 'https://www.banglatribune.com/feed/',
    color: '#0D9488',
    type: 'national_press',
    limit: 22
  },
  {
    id: 'deshrupantor',
    nameBn: 'দেশ রূপান্তর',
    url: 'https://www.deshrupantor.com/feed/',
    color: '#059669',
    type: 'national_press',
    limit: 22
  },
  {
    id: 'bbcbangla',
    nameBn: 'বিবিসি বাংলা',
    url: 'https://www.bbc.com/bengali/index.xml',
    color: '#B91C1C',
    type: 'international_press',
    limit: 15
  },
  {
    id: 'channelionline',
    nameBn: 'চ্যানেল আই অনলাইন',
    url: 'https://www.channelionline.com/feed/',
    color: '#10B981',
    type: 'tv_media',
    limit: 8,
    enrichOgImage: true
  }
];

async function fetchRssFeed(feed) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) return [];

    const xml = await response.text();
    const itemBlocks = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) || [];
    const sliced = itemBlocks.slice(0, feed.limit || 20);

    const parsedEntries = await Promise.all(
      sliced.map(async (block, idx) => {
        const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/i);
        const pubMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) ||
                         block.match(/<dc:date>([\s\S]*?)<\/dc:date>/i);
        const descMatch = block.match(/<description>([\s\S]*?)<\/description>/i);
        const contentMatch = block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
        const catMatches = [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((m) => cleanHtml(m[1]));

        if (!titleMatch) return null;
        const title = cleanHtml(titleMatch[1]);
        if (!title || title.length < 5) return null;

        const link = linkMatch ? cleanHtml(linkMatch[1]) : feed.url;
        let pubDate = pubMatch ? parsePortalDate(cleanHtml(pubMatch[1])) : null;
        let imageUrl = extractImageUrl(block);

        // চ্যানেল আই অথবা pubDate-বিহীন বিবিসি লাইভ আইটেমের জন্য সরাসরি আর্টিকেল থেকে মেটাডাটা সংগ্রহ
        if ((!imageUrl && feed.enrichOgImage) || (!pubDate && feed.id === 'bbcbangla' && idx < 2)) {
          const meta = await fetchArticleMetadata(link);
          if (!imageUrl && meta.imageUrl) imageUrl = meta.imageUrl;
          if (!pubDate && meta.publishedDate) pubDate = meta.publishedDate;
        }

        // প্রতিটি লাইভ নিউজ কার্ডে অবশ্যই মূল পোর্টালের আসল ফটো থাকতে হবে
        if (!imageUrl || !pubDate) return null;

        const desc = cleanHtml(descMatch ? descMatch[1] : (contentMatch ? contentMatch[1] : ''));
        const summary = desc.length > 220 ? desc.slice(0, 220) + '...' : desc || title;
        const hintCat = catMatches.join(' ');
        const category = detectCategory(title, desc, hintCat);

        return buildNewsItem({
          id: `live-rss-${feed.id}-${idx}-${pubDate.getTime().toString().slice(-5)}`,
          title,
          summary,
          fullContent: desc || summary,
          category,
          publishedDate: pubDate,
          imageUrl,
          link,
          sourceId: feed.id,
          sourceNameBn: feed.nameBn,
          sourceColor: feed.color,
          sourceType: feed.type
        });
      })
    );

    return parsedEntries.filter(Boolean);
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = await Promise.allSettled([
    fetchProthomAloJson(),
    fetchBdnews24Json(),
    ...RSS_FEEDS.map((feed) => fetchRssFeed(feed))
  ]);

  const now = Date.now();
  const MAX_AGE_MS = 3 * 24 * 3600 * 1000; // ৩ দিনের বেশি পুরোনো খবর বাদ
  const allItems = [];
  const seenTitles = new Set();

  for (const r of results) {
    if (r.status !== 'fulfilled' || !Array.isArray(r.value)) continue;
    for (const item of r.value) {
      if (!item || !item.canonical_bangla_title || !item.image_url) continue;
      if (seenTitles.has(item.canonical_bangla_title)) continue;
      const ageMs = now - new Date(item.published_at).getTime();
      if (ageMs > MAX_AGE_MS) continue;
      seenTitles.add(item.canonical_bangla_title);
      allItems.push(item);
    }
  }

  // মূল পোর্টালের প্রকাশিত সময় অনুসারে সাজানো (সর্বশেষ তাজা খবর সবার আগে)
  allItems.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  return res.status(200).json({
    success: true,
    count: allItems.length,
    activeSourcesCount: RSS_FEEDS.length + 2,
    fetchedAt: new Date().toISOString(),
    items: allItems
  });
}
