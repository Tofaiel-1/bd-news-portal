/**
 * auto_crawler_daemon.js
 * ব্যাকগ্রাউন্ড অটোমেটেড ক্রলার শিডিউলার।
 * এটি অবিরাম প্রতি ২ মিনিট পর পর সরাসরি বিডিনিউজ২৪, দ্য ডেইলি স্টার, 
 * প্রথম আলো ও শীর্ষ টিভি চ্যানেল থেকে তাজা সংবাদ সংগ্রহ করে সাইট আপডেট করে।
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.join(__dirname, 'build_100pct_real_news.js');
const INTERVAL_MS = 2 * 60 * 1000; // প্রতি ২ মিনিট (১২০ সেকেন্ড)

let isRunning = false;
let runCount = 0;

function runCrawler() {
  if (isRunning) {
    console.log('[DAEMON] Previous crawl cycle is still in progress. Skipping...');
    return;
  }

  isRunning = true;
  runCount += 1;
  const startTime = new Date();
  console.log(`\n================================================================`);
  console.log(`[DAEMON] #${runCount} Auto-crawl cycle started at: ${startTime.toLocaleTimeString('bn-BD')}`);
  console.log(`================================================================`);

  const proc = spawn('node', [SCRIPT_PATH], { stdio: 'inherit' });

  proc.on('close', (code) => {
    isRunning = false;
    const duration = ((Date.now() - startTime.getTime()) / 1000).toFixed(1);
    if (code === 0) {
      console.log(`[DAEMON] #${runCount} Auto-crawl completed successfully in ${duration}s!`);
      console.log(`[DAEMON] Next auto-sync scheduled in 2 minutes...`);
    } else {
      console.error(`[DAEMON] #${runCount} Auto-crawl finished with exit code ${code}`);
    }
  });

  proc.on('error', (err) => {
    isRunning = false;
    console.error(`[DAEMON] #${runCount} Failed to spawn crawler:`, err);
  });
}

// অবিলম্বে ১ম সাইকেল রান করা
runCrawler();

// প্রতি ২ মিনিট পর পর নিয়মিত অটোমেটেড এক্সিকিউশন
setInterval(runCrawler, INTERVAL_MS);

console.log(`[DAEMON] Background news daemon initialized. Crawling every 2 minutes.`);
