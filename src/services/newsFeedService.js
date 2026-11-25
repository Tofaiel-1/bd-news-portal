/**
 * newsFeedService.js
 * বাংলাদেশের শীর্ষ জাতীয় ও আন্তর্জাতিক গণমাধ্যম থেকে সরাসরি সংবাদ সংগ্রহ
 * এবং চ্যানেল মেটাডাটা ব্যবস্থাপনা ইঞ্জিন।
 */

import { REAL_MEDIA_NEWS_DATA } from '../data/realMediaNewsData.js';
import { fetchLiveRssNews } from './liveRssService.js';
import { getAccurateTimeAgo } from '../utils/dateUtils.js';

// সক্রিয় শীর্ষ গণমাধ্যম পোর্টাল ও চ্যানেলের তালিকা (লাইভ ও আর্কাইভের সাথে শতভাগ মিল)
export const TOP_TV_CHANNELS = [
  {
    id: 'all',
    nameBn: 'সব গণমাধ্যম ও পোর্টাল',
    nameEn: 'All Channels',
    color: '#10B981',
    accentGradient: 'from-emerald-500 to-teal-600',
    logoText: '🌐',
    type: 'all',
    isLive: true
  },
  {
    id: 'prothomalo',
    nameBn: 'প্রথম আলো',
    nameEn: 'Prothom Alo',
    color: '#0284C7',
    accentGradient: 'from-sky-600 to-blue-800',
    logoText: '📰',
    type: 'national_press',
    isLive: true,
    website: 'https://www.prothomalo.com'
  },
  {
    id: 'bdnews24',
    nameBn: 'বিডিনিউজ ২৪',
    nameEn: 'bdnews24',
    color: '#DC2626',
    accentGradient: 'from-red-600 to-rose-700',
    logoText: '🔴',
    type: 'national_press',
    isLive: true,
    website: 'https://bangla.bdnews24.com'
  },
  {
    id: 'ittefaq',
    nameBn: 'দৈনিক ইত্তেফাক',
    nameEn: 'The Daily Ittefaq',
    color: '#D97706',
    accentGradient: 'from-amber-600 to-orange-700',
    logoText: '🗞️',
    type: 'national_press',
    isLive: true,
    website: 'https://www.ittefaq.com.bd'
  },
  {
    id: 'banglatribune',
    nameBn: 'বাংলা ট্রিবিউন',
    nameEn: 'Bangla Tribune',
    color: '#0D9488',
    accentGradient: 'from-teal-600 to-emerald-700',
    logoText: '⚡',
    type: 'national_press',
    isLive: true,
    website: 'https://www.banglatribune.com'
  },
  {
    id: 'deshrupantor',
    nameBn: 'দেশ রূপান্তর',
    nameEn: 'Desh Rupantor',
    color: '#059669',
    accentGradient: 'from-emerald-600 to-green-700',
    logoText: '📌',
    type: 'national_press',
    isLive: true,
    website: 'https://www.deshrupantor.com'
  },
  {
    id: 'bbcbangla',
    nameBn: 'বিবিসি বাংলা',
    nameEn: 'BBC Bangla',
    color: '#B91C1C',
    accentGradient: 'from-red-600 to-rose-800',
    logoText: '🌍',
    type: 'international_press',
    isLive: true,
    website: 'https://www.bbc.com/bengali'
  },
  {
    id: 'channelionline',
    nameBn: 'চ্যানেল আই অনলাইন',
    nameEn: 'Channel i Online',
    color: '#10B981',
    accentGradient: 'from-emerald-500 to-teal-700',
    logoText: '📺',
    type: 'tv_media',
    isLive: true,
    website: 'https://www.channelionline.com'
  },
  {
    id: 'dailystar',
    nameBn: 'দ্য ডেইলি স্টার',
    nameEn: 'The Daily Star',
    color: '#1E3A8A',
    accentGradient: 'from-blue-700 to-indigo-950',
    logoText: '⭐',
    type: 'national_press',
    isLive: true,
    website: 'https://bangla.thedailystar.net'
  }
];

export const getChannelMetadata = (channelId) => {
  return TOP_TV_CHANNELS.find(c => c.id === channelId) || TOP_TV_CHANNELS[1];
};

/**
 * লাইভ আপডেট ফেচিং (মূল পোর্টালের রুট টাইমস্ট্যাম্প অক্ষুণ্ণ রেখে)
 */
export async function fetchLiveNewsUpdates() {
  const now = new Date();
  try {
    const liveItems = await fetchLiveRssNews();
    if (Array.isArray(liveItems) && liveItems.length > 0) {
      return {
        liveItems,
        newEvent: liveItems[0],
        timestamp: now
      };
    }
  } catch {
    // নীরব হ্যান্ডলিং
  }

  return {
    liveItems: [],
    newEvent: null,
    timestamp: now
  };
}

/**
 * প্রাথমিক নিউজ ডাটাতে চ্যানেল মেটাডাটা নিশ্চিতকরণ ও ডুপ্লিকেট দূরীকরণ
 */
export function enrichNewsWithChannels(events = []) {
  const seenTitles = new Set();
  const uniqueList = [];

  for (const evt of events) {
    if (!evt || !evt.canonical_bangla_title) continue;
    if (seenTitles.has(evt.canonical_bangla_title)) continue;

    seenTitles.add(evt.canonical_bangla_title);
    uniqueList.push({
      ...evt,
      dateKey: evt.dateKey || (evt.published_at ? evt.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10)),
      time_ago: getAccurateTimeAgo(evt.published_at, evt.time_ago),
      sourceType: evt.sourceType || 'national_press',
      sourceChannel: evt.sourceChannel || {
        id: evt.primarySource?.id || 'prothomalo',
        nameBn: evt.primarySource?.nameBn || 'গণমাধ্যম',
        type: 'জাতীয় গণমাধ্যম',
        badgeColor: evt.primarySource?.color || '#0284C7',
        verified: true
      },
      primarySource: evt.primarySource || {
        id: 'prothomalo',
        nameBn: 'প্রথম আলো',
        color: '#0284C7',
        verified: true,
        website: 'https://www.prothomalo.com'
      }
    });
  }

  return uniqueList;
}
