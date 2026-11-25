import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Flame,
  Radio,
  ArrowRight,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { sanitizeUrl } from '../utils/security';
import { toBanglaNumber, getAccurateTimeAgo } from '../utils/dateUtils';
import NewsImageFallback from './NewsImageFallback';

function SafePortalImage({ item, className, loading = 'lazy', compact = false }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [item?.id, item?.image_url]);

  if (!item?.image_url || hasError) {
    return (
      <NewsImageFallback
        sourceName={item?.primarySource?.nameBn}
        category={item?.category}
        color={item?.primarySource?.color || '#059669'}
        compact={compact}
      />
    );
  }

  return (
    <img
      src={item.image_url}
      alt={item.canonical_bangla_title}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
}

export default function TopNewsShowcase({
  topNews = [],
  onOpenDetail
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
                <span>শীর্ষ {toBanglaNumber(topNews.length)} সংবাদ</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              দেশের প্রধান ও আন্তর্জাতিক গণমাধ্যমের সর্বশেষ প্রকাশিত সংবাদের বিশেষ সংকলন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>সরাসরি মূল পোর্টাল</span>
          </span>
        </div>
      </div>

      {/* ২. টপ নিউজ প্রধান গ্রিড (Hero + Secondary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">

        {/* ২.১ ১ম শীর্ষ সংবাদ */}
        {heroNews && (
          <div
            onClick={() => onOpenDetail(heroNews)}
            className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-newspaper dark:shadow-xl hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between relative"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
              <SafePortalImage
                item={heroNews}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-black/30 pointer-events-none" />

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
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>ব্রেকিং</span>
                  </span>
                )}
              </div>

              {heroNews.primarySource && (
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
                    style={{ backgroundColor: heroNews.primarySource.color || '#0284C7' }}
                  >
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{heroNews.primarySource.nameBn}</span>
                  </span>
                </div>
              )}

              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-900/90 text-white uppercase tracking-wider backdrop-blur-md border border-white/10">
                    {heroNews.category}
                  </span>
                  <span className="text-[11px] font-bold text-white bg-black/75 px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1 border border-white/15">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {getAccurateTimeAgo(heroNews.published_at, heroNews.time_ago)}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight group-hover:text-emerald-300 transition-colors drop-shadow-md line-clamp-3">
                  {heroNews.canonical_bangla_title}
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 space-y-3.5">
              <p className="text-sm sm:text-[15px] text-stone-700 dark:text-stone-300 font-sans leading-relaxed line-clamp-2">
                {heroNews.summary_bangla}
              </p>

              <div className="bg-stone-50 dark:bg-stone-800/80 p-2.5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">পাঠক গুরুত্ব:</span>
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
                    ✓ প্রকাশিত: {heroNews.primarySource?.nameBn || 'জাতীয় গণমাধ্যম'}
                  </span>
                  <span>•</span>
                  <span>{getAccurateTimeAgo(heroNews.published_at, heroNews.time_ago)}</span>
                </div>
              </div>

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
                  <span>সম্পূর্ণ প্রতিবেদন পড়ুন</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ২.২ ২য় ও ৩য় শীর্ষ সংবাদ */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
          {secondaryNews.map((secItem, idx) => {
            const rankNumber = idx + 2;

            return (
              <article
                key={secItem.id}
                onClick={() => onOpenDetail(secItem)}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer group flex flex-col justify-between flex-1 relative"
              >
                <div>
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

                  <div className="flex items-start gap-3">
                    <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 relative border border-stone-200 dark:border-stone-700">
                      <SafePortalImage
                        item={secItem}
                        compact={true}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px] truncate">
                      {secItem.primarySource?.nameBn || 'গণমাধ্যম'}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px] shrink-0">
                      {getAccurateTimeAgo(secItem.published_at, secItem.time_ago)}
                    </span>
                  </div>

                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>বিস্তারিত</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ৩. ৪র্থ থেকে ৭ম শীর্ষ সংবাদ */}
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
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-2 border border-stone-100 dark:border-stone-800">
                    <SafePortalImage
                      item={item}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-stone-900/90 text-amber-400 border border-white/20 backdrop-blur-md">
                      {toBanglaNumber(rank)}নং খবর
                    </span>

                    {item.primarySource && (
                      <span
                        className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                        style={{ backgroundColor: item.primarySource.color || '#0284C7' }}
                      >
                        {item.primarySource.nameBn}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-bold truncate">{item.category}</span>
                    <span className="font-mono shrink-0">{getAccurateTimeAgo(item.published_at, item.time_ago)}</span>
                  </div>

                  <h5 className="font-serif text-xs sm:text-[13px] font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.canonical_bangla_title}
                  </h5>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {item.primarySource?.nameBn || 'জাতীয়'}
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
