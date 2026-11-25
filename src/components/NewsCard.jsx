import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  Volume2,
  VolumeX,
  Radio,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Globe,
  Clock
} from 'lucide-react';
import { VERIFICATION_STATUSES } from '../data/locations';
import { sanitizeUrl } from '../utils/security';
import { speakBangla, stopSpeech } from '../utils/speechUtils';
import { getAccurateTimeAgo } from '../utils/dateUtils';
import NewsImageFallback from './NewsImageFallback';

export default function NewsCard({
  event,
  onOpenDetail,
  isBookmarked,
  onToggleBookmark,
  onOpenSocialCard
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showQuickTake, setShowQuickTake] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [event?.id, event?.image_url]);

  const statusMeta = VERIFICATION_STATUSES[event.status] || VERIFICATION_STATUSES.officially_confirmed;
  const elapsedLabel = getAccurateTimeAgo(event.published_at, event.time_ago);
  const hasRealImage = Boolean(event.image_url) && !imgError;

  const categoryTheme = {
    'যোগাযোগ ও পরিবহন': { border: 'hover:border-orange-400 dark:hover:border-orange-500', line: 'from-orange-500 to-amber-500' },
    'কৃষি, প্রকৃতি ও পরিবেশ': { border: 'hover:border-emerald-400 dark:hover:border-emerald-500', line: 'from-emerald-500 to-teal-500' },
    'বাণিজ্য ও অর্থনীতি': { border: 'hover:border-blue-400 dark:hover:border-blue-500', line: 'from-blue-500 to-indigo-500' },
    'স্বাস্থ্য ও চিকিৎসা': { border: 'hover:border-rose-400 dark:hover:border-rose-500', line: 'from-rose-500 to-red-500' },
    'বিজ্ঞান ও প্রযুক্তি': { border: 'hover:border-purple-400 dark:hover:border-purple-500', line: 'from-purple-500 to-indigo-500' },
    'শিক্ষা ও ক্যারিয়ার': { border: 'hover:border-violet-400 dark:hover:border-violet-500', line: 'from-violet-500 to-purple-500' },
    'আবহাওয়া ও দুর্যোগ': { border: 'hover:border-sky-400 dark:hover:border-sky-500', line: 'from-sky-500 to-cyan-500' },
    'খেলাধুলা': { border: 'hover:border-pink-400 dark:hover:border-pink-500', line: 'from-pink-500 to-rose-500' },
    'বিনোদন ও সংস্কৃতি': { border: 'hover:border-fuchsia-400 dark:hover:border-fuchsia-500', line: 'from-fuchsia-500 to-pink-500' },
    'আইন ও আদালত': { border: 'hover:border-amber-500 dark:hover:border-amber-500', line: 'from-amber-600 to-red-600' }
  }[event.category] || { border: 'hover:border-emerald-400 dark:hover:border-emerald-500', line: 'from-emerald-500 to-teal-500' };

  const isBreaking = event.freshness === 'breaking';

  const handleToggleSpeech = (e) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${event.canonical_bangla_title}। ${event.summary_bangla}`;
      speakBangla(
        speechText,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.canonical_bangla_title,
        text: event.summary_bangla,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareMenu(prev => !prev);
    }
  };

  const copyUrl = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${event.canonical_bangla_title}\n${event.articleUrl || window.location.href}`);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowShareMenu(false);
    }, 2000);
  };

  const shareWhatsApp = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(`*${event.canonical_bangla_title}*\n\n${event.summary_bangla}\n\nবিস্তারিত পড়ুন: ${event.articleUrl || window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  return (
    <article
      onClick={() => onOpenDetail(event)}
      className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl dark:hover:shadow-stone-950/70 transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer relative ${
        categoryTheme.border
      } ${isBreaking ? 'border-rose-400/70 dark:border-rose-500/70 ring-1 ring-rose-500/20' : ''}`}
    >
      {/* ক্যাটাগরি এক্সেন্ট লাইন */}
      <div className={`h-1 w-full bg-gradient-to-r ${categoryTheme.line}`} />

      <div>
        {/* ১. ফটো কনটেইনার — শুধুমাত্র মূল পোর্টালের আসল ফটো */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          {hasRealImage ? (
            <img
              src={event.image_url}
              alt={event.canonical_bangla_title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <NewsImageFallback
              sourceName={event.primarySource?.nameBn}
              category={event.category}
              color={event.primarySource?.color || '#059669'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/15 to-black/30 pointer-events-none" />

          {/* টপ বার: পরিধি ও মূল সোর্স ব্যাজ */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            <div className="min-w-0 shrink">
              {event.scope === 'international' || event.category === 'আন্তর্জাতিক ও বিশ্ব' ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-950/90 text-sky-200 backdrop-blur-md flex items-center gap-1 shadow-sm border border-sky-400/40">
                  <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>আন্তর্জাতিক</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-200 backdrop-blur-md flex items-center gap-1 shadow-sm border border-emerald-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <span>সারাদেশ</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 justify-end shrink-0">
              {event.isLiveRealTime && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>লাইভ</span>
                </span>
              )}
              {event.primarySource && (
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm backdrop-blur-md flex items-center gap-1 border border-white/20"
                  style={{ backgroundColor: event.primarySource.color || '#0284C7' }}
                >
                  <Radio className="w-2.5 h-2.5" />
                  <span>{event.primarySource.nameBn}</span>
                </span>
              )}
            </div>
          </div>

          {/* বটম বার: ক্যাটাগরি ও মূল পোর্টালের রুট সময় */}
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            <div className="flex items-center gap-1 min-w-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/90 text-white backdrop-blur-md border border-white/10 shadow-xs truncate">
                {event.category}
              </span>
              {isBreaking && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white shadow-sm shrink-0">
                  ব্রেকিং
                </span>
              )}
            </div>

            <div className="shrink-0 text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded backdrop-blur-md border border-white/15 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-emerald-400" />
              <span>{elapsedLabel}</span>
            </div>
          </div>
        </div>

        {/* ২. কার্ডের মূল কনটেন্ট */}
        <div className="p-3 sm:p-3.5">
          {/* পরিচ্ছন্ন এডিটোরিয়াল মেটা রো */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/70">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{statusMeta.shortBn === 'নিশ্চিত' ? 'সরাসরি সংবাদ' : statusMeta.shortBn}</span>
            </div>

            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 truncate">
              {event.primarySource?.nameBn || 'জাতীয় ডেস্ক'}
            </span>
          </div>

          {/* প্রধান শিরোনাম */}
          <h3 className="font-serif text-sm sm:text-[15px] font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5">
            {event.canonical_bangla_title}
          </h3>

          {/* সারসংক্ষেপ */}
          <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 font-sans leading-relaxed line-clamp-2 mb-2">
            {event.summary_bangla}
          </p>

          {/* কুইক টেক ড্রপডাউন */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickTake(prev => !prev);
              }}
              className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800 transition-all flex items-center gap-1 cursor-pointer mb-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
              <span>{showQuickTake ? 'সংক্ষেপ লুকান ▲' : '⚡ এক নজরে'}</span>
            </button>

            {showQuickTake && (
              <div className="mt-1.5 p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 text-[11px] space-y-1 animate-fadeIn">
                <div className="text-stone-800 dark:text-stone-200 leading-snug">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">বিষয়: </span>
                  {event.canonical_bangla_title}
                </div>
                <div className="text-stone-800 dark:text-stone-200 leading-snug">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">প্রকাশ: </span>
                  {event.primarySource?.nameBn || 'জাতীয় গণমাধ্যম'} • {elapsedLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ৩. কার্ড অ্যাকশন ফুটার */}
      <div className="px-3 py-2 bg-stone-50/90 dark:bg-stone-950/70 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleSpeech}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            }`}
            title={isPlayingAudio ? 'পড়া বন্ধ করুন' : 'বাংলায় শুনুন'}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            title={isBookmarked ? 'সংরক্ষণ বাতিল' : 'সংরক্ষণ করুন'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-800 dark:fill-emerald-400' : ''}`} />
          </button>

          <div className="relative">
            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-lg border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              title="শেয়ার করুন"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {showShareMenu && (
              <div
                className="absolute left-0 bottom-full mb-1.5 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-1 min-w-[125px] z-30 flex flex-col gap-0.5 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={shareWhatsApp}
                  className="w-full px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={copyUrl}
                  className="w-full px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-500 dark:text-stone-400" />}
                  <span>{copiedLink ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {event.articleUrl && (
            <a
              href={sanitizeUrl(event.articleUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold flex items-center gap-0.5 shadow-2xs hover:scale-105 transition-all cursor-pointer"
              title={`${event.primarySource?.nameBn || 'মূল পোর্টাল'} থেকে সরাসরি পড়ুন`}
            >
              <span>মূল খবর</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            </a>
          )}
          <span className="text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>বিস্তারিত</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </span>
        </div>
      </div>
    </article>
  );
}
