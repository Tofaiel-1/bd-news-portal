// সমৃদ্ধ ও নির্ভরযোগ্য বাংলাদেশ উপজেলা সংবাদ এবং প্রমাণ যাচাইকরণ ডাটাবেজ
// শীর্ষ জাতীয় গণমাধ্যম (প্রথম আলো, বিবিসি বাংলা) থেকে সরাসরি আসল সংবাদ ও চিত্র সংবলিত

import { REAL_MEDIA_NEWS_DATA } from './realMediaNewsData.js';

export const INITIAL_NEWS_EVENTS = REAL_MEDIA_NEWS_DATA;

export const BREAKING_TICKER_ITEMS = REAL_MEDIA_NEWS_DATA.slice(0, 10).map((item, idx) => ({
  id: `brk-${idx + 1}`,
  eventId: item.id,
  textBn: item.canonical_bangla_title,
  tagBn: item.sourceChannel?.nameBn || 'যাচাইকৃত',
  type: 'official'
}));
