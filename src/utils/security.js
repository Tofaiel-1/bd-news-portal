/**
 * security.js
 * সাইবার সিকিউরিটি, এক্সএসএস (XSS) প্রতিরোধ ও ইনপুট স্যানিটাইজেশন ইউটিলিটি।
 * এটি ক্ষতিকর বোট, স্ক্রিপ্ট ইনজেকশন ও ব্রাউজারভিত্তিক সাইবার আক্রমণ প্রতিহত করে।
 */

/**
 * ইউআরএল স্যানিটাইজার: javascript: বা vbscript: ইত্যাদি দূষিত লিঙ্ক ব্লক করে
 * শুধুমাত্র নিরাপদ https: বা http: প্রোটোকল অনুমোদন করে
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  
  // javascript: বা data: এক্সিকিউটেবল স্কিম ব্লক
  const dangerousProtocols = /^(\s*javascript:|\s*data:text\/html|\s*vbscript:)/i;
  if (dangerousProtocols.test(trimmed)) {
    console.warn('[SECURITY ALERT] Malicious URL scheme blocked:', trimmed);
    return '#';
  }

  // শুধুমাত্র http, https বা অ্যাবসলিউট পাথ এলাও
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/')) {
    return encodeURI(trimmed);
  }

  return '#';
}

/**
 * টেক্সট ইনপুট স্যানিটাইজার: HTML ট্যাগ বা স্ক্রিপ্ট ইনজেকশন ফিল্টার করে
 */
export function sanitizeText(input = '', maxLength = 1000) {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/<script[\s\S]*?<\/script>/gi, '') // স্ক্রিপ্ট ট্যাগ রিমুভ
    .replace(/<[^>]*>?/gm, '') // সাধারণ এইচটিএমএল ট্যাগ ফিল্টার
    .trim();
}

/**
 * ক্লায়েন্ট-সাইড রেট লিমিটার (ফ্লাড ও স্প্যামিং প্রতিরোধক)
 * ইউজার বা বটের একই অ্যাকশন মাত্রাতিরিক্ত কল বন্ধ করে
 */
const rateLimitMap = new Map();

export function isRateLimited(actionKey, limit = 5, windowMs = 10000) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(actionKey) || [];
  
  // নির্ধারিত সময়ের বাইরের টাইমস্ট্যাম্প ফিল্টার
  const recent = timestamps.filter(ts => now - ts < windowMs);
  
  if (recent.length >= limit) {
    return true; // লিমিট অতিক্রম করেছে
  }

  recent.push(now);
  rateLimitMap.set(actionKey, recent);
  return false;
}
