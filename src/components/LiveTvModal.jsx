import React, { useState } from 'react';
import { X, Tv, Radio, ExternalLink, ShieldCheck, Volume2, Sparkles } from 'lucide-react';
import { TOP_TV_CHANNELS } from '../services/newsFeedService';

const LIVE_STREAMS = [
  {
    id: 'somoytv',
    nameBn: 'সময় টিভি লাইভ',
    nameEn: 'Somoy TV Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC8p8zKz2kU6b8lQxQ8fWf9A',
    directUrl: 'https://somoynews.tv/live',
    youtubeSearch: 'https://www.youtube.com/@somoytvnet/live',
    color: '#E11D48',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  },
  {
    id: 'jamunatv',
    nameBn: 'যমুনা টিভি লাইভ',
    nameEn: 'Jamuna TV Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCYn4Z6k4e3Pz5hHh1b2w3xQ',
    directUrl: 'https://jamuna.tv/live',
    youtubeSearch: 'https://www.youtube.com/@JamunaTVbd/live',
    color: '#0284C7',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  },
  {
    id: 'channel24',
    nameBn: 'চ্যানেল ২৪ লাইভ',
    nameEn: 'Channel 24 Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC04b8Ckg79gL01qA_zD3Q8w',
    directUrl: 'https://channel24bd.tv/live',
    youtubeSearch: 'https://www.youtube.com/@channel24youtube/live',
    color: '#4F46E5',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  },
  {
    id: 'ekattor',
    nameBn: 'একাত্তর টিভি লাইভ',
    nameEn: 'Ekattor TV Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCkQZ9lZq8kZqZqZqZqZqZqZ',
    directUrl: 'https://ekattor.tv',
    youtubeSearch: 'https://www.youtube.com/@EkattorTelevision/live',
    color: '#DC2626',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  },
  {
    id: 'dbc',
    nameBn: 'ডিবিসি নিউজ লাইভ',
    nameEn: 'DBC News Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCc_7Y0Pz_v0qV9Qz_w',
    directUrl: 'https://dbcnews.tv',
    youtubeSearch: 'https://www.youtube.com/@DBCNewsBD/live',
    color: '#D97706',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  },
  {
    id: 'independent',
    nameBn: 'ইনডিপেনডেন্ট টিভি লাইভ',
    nameEn: 'Independent TV Live',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC0dKq1Kq1Kq1Kq1Kq1Kq1Kq',
    directUrl: 'https://independent24.com',
    youtubeSearch: 'https://www.youtube.com/@IndependentTelevision/live',
    color: '#059669',
    frequency: '24/7 লাইভ ব্রডকাস্ট'
  }
];

export default function LiveTvModal({ isOpen, onClose }) {
  const [selectedChannelId, setSelectedChannelId] = useState('somoytv');

  if (!isOpen) return null;

  const activeChannel = LIVE_STREAMS.find(c => c.id === selectedChannelId) || LIVE_STREAMS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-stone-900 border border-stone-800 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* মডাল হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-600/20 text-red-500">
              <Tv className="w-5 h-5 text-red-500 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  বাংলাদেশের শীর্ষ টিভি চ্যানেল লাইভ স্ট্রিম
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                  LIVE 24/7
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans">
                সরাসরি সম্প্রচার দেখুন এবং ব্রেকিং নিউজ মিলিয়ে নিন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* চ্যানেল সিলেকশন ট্যাবসমূহ */}
        <div className="bg-stone-950/80 px-4 py-2.5 border-b border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {LIVE_STREAMS.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-500/50'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>{ch.nameBn}</span>
              </button>
            );
          })}
        </div>

        {/* প্লেয়ার সেকশন */}
        <div className="p-4 sm:p-6 bg-stone-900 flex-1 overflow-y-auto space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl flex items-center justify-center">
            {/* লাইভ স্ট্রিম ফ্রেম বা ইন্টারেক্টিভ ওয়াচ হাব */}
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mb-3 animate-pulse">
                <Radio className="w-8 h-8" />
              </div>
              
              <h4 className="font-serif text-xl sm:text-2xl font-extrabold text-white mb-2">
                {activeChannel.nameBn}
              </h4>
              
              <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed mb-5">
                সর্বশেষ সংবাদ সরাসরি দেখতে নিচের অফিশিয়াল লাইভ ব্রডকাস্ট বাটনে ক্লিক করুন। ইউজার আকর্ষণ ও দ্রুত স্ট্রিমিংয়ের জন্য হাই-স্পিড চ্যানেল লিঙ্ক প্রস্তুত।
              </p>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <a
                  href={activeChannel.youtubeSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Tv className="w-4 h-4" />
                  <span>অফিশিয়াল ইউটিউব লাইভ খুলুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={activeChannel.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>চ্যানেল ওয়েবসাইট লাইভ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* চ্যানেল মেটা ও ভেরিফিকেশন তথ্য */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                এই চ্যানেলের সংবাদসমূহ স্বয়ংক্রিয়ভাবে আমাদের <strong>১-মিনিট লাইভ সিঙ্কে</strong> অন্তর্ভুক্ত।
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              {activeChannel.frequency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
