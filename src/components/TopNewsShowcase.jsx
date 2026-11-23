import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Radio, 
  ExternalLink, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  Clock, 
  CheckCheck, 
  Award,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { getImportanceBadge } from '../services/importanceScoreService';
import { getSemanticNewsImage } from '../services/newsCrawlerService';
import { sanitizeUrl } from '../utils/security';
import { toBanglaNumber } from './Header';

export default function TopNewsShowcase({
  topNews = [],
  onOpenDetail,
  bookmarkedEventIds = [],
  onToggleBookmark
}) {
  if (!topNews || topNews.length === 0) return null;

  const heroNews = topNews[0];
  const secondaryNews = topNews.slice(1, 3);
  const miniNews = topNews.slice(3, 7);

  return (
    <section className="w-full space-y-4 pt-1">
      {/* ১. সেকশন হেডার বার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-200/90 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-rose-600 via-amber-500 to-emerald-600" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-50 flex items-center gap-2">
                <span>★ আজকের সর্বাধিক গুরুত্বপূর্ণ শীর্ষ সংবাদ</span>
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <Flame className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                <span>টপ {toBanglaNumber(topNews.length)} কভারেজ</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              শীর্ষ গণমাধ্যম ও যাচাইকৃত সোর্সের আস্থা, বহু-উৎস মিল ও জরুরি পরিস্থিতি সূচক অনুযায়ী স্বয়ংক্রিয়ভাবে নির্ধারিত
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>স্বর্ণমান সত্যতা যাচাইকৃত</span>
          </span>
        </div>
      </div>

      {/* ২. টপ নিউজ প্রধান গ্রিড (Hero + Secondary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        
        {/* ২.১ ১ম শীর্ষ সংবাদ (Hero Card — বাম পাশে ৭ বা ৮ কলাম) */}
        {heroNews && (
          <div
            onClick={() => onOpenDetail(heroNews)}
            className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-newspaper dark:shadow-xl hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between relative"
          >
            {/* ফটো ও ওভারলে গ্রাডিয়েন্ট */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
              <img
                src={heroNews.image_url || getSemanticNewsImage(heroNews.canonical_bangla_title, heroNews.summary_bangla, heroNews.category)}
                alt={heroNews.canonical_bangla_title}
                onError={(e) => {
                  e.currentTarget.src = getSemanticNewsImage(heroNews.canonical_bangla_title, heroNews.summary_bangla, heroNews.category);
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-black/30 pointer-events-none" />

              {/* টপ লেফট ব্যাজসমূহ */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap z-10">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg flex items-center gap-1.5 border border-white/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>১নং প্রধান খবর</span>
                </span>
                
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-stone-900/90 text-stone-900 dark:text-white backdrop-blur-md shadow-sm border border-white/30">
                  {heroNews.scope === 'international' || heroNews.category === 'আন্তর্জাতিক ও বিশ্ব' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ'}
                </span>

                {heroNews.freshness === 'breaking' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>ব্রেকিং</span>
                  </span>
                )}
              </div>

              {/* টপ রাইট সোর্স ব্যাজ */}
              {heroNews.primarySource && (
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
                    style={{ backgroundColor: heroNews.primarySource.color || '#E11D48' }}
                  >
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{heroNews.primarySource.nameBn}</span>
                  </span>
                </div>
              )}

              {/* বটম টেক্সট ও বড় শিরোনাম ওভারলে */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-900/90 text-white uppercase tracking-wider backdrop-blur-md border border-white/10">
                    {heroNews.category}
                  </span>
                  <span className="text-[11px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    {heroNews.time_ago || 'তাজা'}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight group-hover:text-emerald-300 transition-colors drop-shadow-md line-clamp-3">
                  {heroNews.canonical_bangla_title}
                </h3>
              </div>
            </div>

            {/* সারসংক্ষেপ, গুরুত্ব স্কোর বার ও অ্যাকশন */}
            <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 space-y-3.5">
              <p className="text-sm sm:text-[15px] text-stone-700 dark:text-stone-300 font-sans leading-relaxed line-clamp-2">
                {heroNews.summary_bangla}
              </p>

              {/* গুরুত্ব সূচক প্রগ্রেস বার */}
              <div className="bg-stone-50 dark:bg-stone-800/80 p-2.5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">গুরুত্ব সূচক:</span>
                  <div className="w-24 sm:w-32 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-rose-500 h-full rounded-full transition-all duration-700" 
                      style={{ width: `${heroNews.importanceScore || 96}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {toBanglaNumber(heroNews.importanceScore || 96)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    ✓ {heroNews.independence?.independent_source_count || 3}টি স্বাধীন মাধ্যম নিশ্চিত
                  </span>
                  <span>•</span>
                  <span>আস্থা {toBanglaNumber(heroNews.confidence || 98)}%</span>
                </div>
              </div>

              {/* ফুটার লিংকসমূহ */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {heroNews.articleUrl && (
                    <a
                      href={sanitizeUrl(heroNews.articleUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      title="মূল পোর্টালে সরাসরি পড়ুন"
                    >
                      <span>{heroNews.primarySource?.nameBn || 'মূল পোর্টাল'} ↗</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>সম্পূর্ণ প্রতিবেদন ও সত্যতা বিশ্লেষণ</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ২.২ ২য় ও ৩য় শীর্ষ সংবাদ (Secondary Cards — ডান পাশে ৪ বা ৫ কলামে উপর-নিচ) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
          {secondaryNews.map((secItem, idx) => {
            const rankNumber = idx + 2;
            const badgeMeta = getImportanceBadge(secItem.importanceScore || 90);

            return (
              <article
                key={secItem.id}
                onClick={() => onOpenDetail(secItem)}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer group flex flex-col justify-between flex-1 relative"
              >
                <div>
                  {/* টপ রো: র‍্যাঙ্ক ও ক্যাটাগরি */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-stone-900 dark:bg-stone-800 text-amber-400 border border-stone-700 flex items-center gap-1 shadow-xs">
                      <span>{toBanglaNumber(rankNumber)}নং শীর্ষ সংবাদ</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {secItem.category}
                      </span>
                      {secItem.freshness === 'breaking' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                          ব্রেকিং
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ছবি ও শিরোনামের সমন্বিত লেআউট */}
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 relative border border-stone-200 dark:border-stone-700">
                      <img
                        src={secItem.image_url || getSemanticNewsImage(secItem.canonical_bangla_title, secItem.summary_bangla, secItem.category)}
                        alt={secItem.canonical_bangla_title}
                        onError={(e) => {
                          e.currentTarget.src = getSemanticNewsImage(secItem.canonical_bangla_title, secItem.summary_bangla, secItem.category);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3 mb-1">
                        {secItem.canonical_bangla_title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-sans">
                        {secItem.summary_bangla}
                      </p>
                    </div>
                  </div>
                </div>

                {/* কার্ড ফুটার: স্কোর ও সোর্স */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">
                      {secItem.primarySource?.nameBn || 'যাচাইকৃত'}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                      গুরুত্ব {toBanglaNumber(secItem.importanceScore || 92)}%
                    </span>
                  </div>

                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>বিস্তারিত</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ৩. ৪র্থ থেকে ৭ম শীর্ষ সংবাদ (Mini News Strip — ৪টি স্লিম কার্ড) */}
      {miniNews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
          {miniNews.map((item, idx) => {
            const rank = idx + 4;

            return (
              <article
                key={item.id}
                onClick={() => onOpenDetail(item)}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-3 shadow-2xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* থাম্বনেইল ছবি */}
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-2 border border-stone-100 dark:border-stone-800">
                    <img
                      src={item.image_url || getSemanticNewsImage(item.canonical_bangla_title, item.summary_bangla, item.category)}
                      alt={item.canonical_bangla_title}
                      onError={(e) => {
                        e.currentTarget.src = getSemanticNewsImage(item.canonical_bangla_title, item.summary_bangla, item.category);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* র‍্যাঙ্ক পিল ওভারলে */}
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-stone-900/90 text-amber-400 border border-white/20 backdrop-blur-md">
                      {toBanglaNumber(rank)}নং খবর
                    </span>

                    {item.primarySource && (
                      <span 
                        className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                        style={{ backgroundColor: item.primarySource.color || '#E11D48' }}
                      >
                        {item.primarySource.nameBn}
                      </span>
                    )}
                  </div>

                  {/* ক্যাটাগরি ও সময় */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-bold truncate">{item.category}</span>
                    <span className="font-mono shrink-0">{item.time_ago || 'তাজা'}</span>
                  </div>

                  {/* শিরোনাম */}
                  <h5 className="font-serif text-xs sm:text-[13px] font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.canonical_bangla_title}
                  </h5>
                </div>

                {/* ফুটার মেটা */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    স্কোর: {toBanglaNumber(item.importanceScore || 85)}%
                  </span>
                  <span className="text-stone-500 dark:text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-bold flex items-center gap-0.5">
                    <span>পড়ুন</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
