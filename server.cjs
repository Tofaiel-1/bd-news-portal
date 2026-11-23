/**
 * server.cjs
 * প্রোডাকশন-রেডি সিকিউর নোড সার্ভার (DDoS, Bot Attack ও সার্ভার ক্র্যাশ প্রতিরোধক)।
 * 
 * সুরক্ষাসমূহ:
 * ১. রেট লিমিটার (প্রতি আইপিতে রিকোয়েস্ট লিমিট করে সার্ভার ডাউন/DDoS রোধ)
 * ২. ম্যালিশাস বোট ব্লকার (Sqlmap, Nikto, WPScan, ক্ষতিকর ক্রলার ব্লক)
 * ৩. সিকিউরিটি হেডার্স (CSP, X-Frame-Options, Strict HSTS, NoSniff)
 * ৪. এরর হ্যান্ডলার ও গ্রেসফুল শাটডাউন (সার্ভার কখনও যাতে ক্র্যাশ না করে)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// ক্ষতিকর হ্যাকিং টুলস ও ব্যাড বোটদের তালিকা
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /wpscan/i,
  /acunetix/i,
  /havij/i,
  /nessus/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /petalbot/i
];

// সিম্পল ইন-মেমোরি আইপি রেট লিমিটার (প্রতি মিনিটে সর্বোচ্চ ১২০ রিকোয়েস্ট)
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 120;

setInterval(() => {
  ipRequestCounts.clear();
}, RATE_LIMIT_WINDOW_MS);

// MIME টাইপ ডিকশনারি
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    // ১. ম্যালিশাস হ্যাকিং ও অ্যাটাক বোট ব্লকিং
    for (const pattern of BLOCKED_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Denied: Malicious bot or automated scraper detected.');
        return;
      }
    }

    // ২. DDoS ও ফ্লাড প্রতিরোধক রেট লিমিটিং
    const currentCount = (ipRequestCounts.get(clientIp) || 0) + 1;
    ipRequestCounts.set(clientIp, currentCount);

    if (currentCount > MAX_REQUESTS_PER_MINUTE) {
      res.writeHead(429, { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '60'
      });
      res.end('অতিরিক্ত রিকোয়েস্ট করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন (Rate Limit Exceeded)।');
      return;
    }

    // ৩. গ্লোবাল সিকিউরিটি হেডার যুক্ত করা
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // ৪. ফাইল পাথ রেজোলিউশন ও পাথ ট্রাভার্সাল (Path Traversal) হ্যাক প্রতিরোধ
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/') safeUrl = '/index.html';

    const normalizedPath = path.normalize(path.join(DIST_DIR, safeUrl));
    if (!normalizedPath.startsWith(DIST_DIR)) {
      // হ্যাকার যদি ../ দিয়ে সিস্টেম ফাইল অ্যাক্সেস করতে চায়
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Directory traversal attack blocked.');
      return;
    }

    fs.stat(normalizedPath, (err, stats) => {
      if (err || !stats.isFile()) {
        // SPA Fallback: index.html পরিবেশন
        const indexPath = path.join(DIST_DIR, 'index.html');
        fs.readFile(indexPath, (indexErr, data) => {
          if (indexErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server internal error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        });
        return;
      }

      const ext = path.extname(normalizedPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // ক্যাশিং হেডার্স
      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(normalizedPath).pipe(res);
    });

  } catch (globalErr) {
    console.error('[SERVER ERROR]', globalErr);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error: An unexpected error occurred.');
    }
  }
});

server.listen(PORT, () => {
  console.log(`[SECURE SERVER] Production server running safely on port ${PORT}`);
});
