import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Share2,
  Bookmark,
  Flag,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileText,
  History,
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  MessageCircle,
  Globe
} from 'lucide-react';
import { VERIFICATION_STATUSES } from '../data/locations';
import { speakBangla, stopSpeech } from '../utils/speechUtils';
import { sanitizeUrl } from '../utils/security';
import { getAccurateTimeAgo, formatExactBanglaDateTime } from '../utils/dateUtils';
import NewsImageFallback from './NewsImageFallback';

export default function EventDetailModal({
  event,
  onClose,
  onOpenCorrection,
  isBookmarked,
  onToggleBookmark
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    stopSpeech();
    setIsPlayingAudio(false);
  }, [event?.id, event?.image_url]);

  if (!event) return null;

  const hasRealImage = Boolean(event.image_url) && !imgError;
  const elapsedLabel = getAccurateTimeAgo(event.published_at, event.time_ago);
  const exactPublishedTime = formatExactBanglaDateTime(event.published_at);
  const statusMeta = VERIFICATION_STATUSES[event.status] || VERIFICATION_STATUSES.officially_confirmed;

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const fullText = `${event.canonical_bangla_title}। ${event.summary_bangla}। ${event.ai_generated_summary || ''}`;
      speakBangla(
        fullText,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShare = () => {
    const shareUrl = event.articleUrl || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event.canonical_bangla_title,
        text: event.summary_bangla,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${event.canonical_bangla_title} - ${shareUrl}`);
      alert('খবরের লিংক কপি করা হয়েছে!');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="bg-white dark:bg-stone-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* মডাল হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badgeClass}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সরাসরি যাচাইকৃত</span>
            </span>

            {event.primarySource && (
              <>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-700 dark:text-stone-300 font-bold">
                  {event.primarySource.nameBn}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(event.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
              title={isBookmarked ? 'সংরক্ষণ তালিকা থেকে মুছুন' : 'সংরক্ষণ করুন'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-800 dark:fill-emerald-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* মডাল স্ক্রলযোগ্য বডি */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-stone-800 dark:text-stone-200">
          {/* পরিধি ও মূল পোর্টালের রুট প্রকাশ সময় */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-sans flex-wrap">
            {event.scope === 'international' || event.category === 'আন্তর্জাতিক ও বিশ্ব' ? (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>আন্তর্জাতিক সংবাদ</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>সারাদেশ • বাংলাদেশ</span>
              </span>
            )}
            <span className="text-stone-400">•</span>
            <span className="text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>মূল প্রকাশ: {elapsedLabel}</span>
              {exactPublishedTime && (
                <span className="text-stone-500 dark:text-stone-400 font-normal">
                  ({exactPublishedTime})
                </span>
              )}
            </span>
          </div>

          {/* ক্যানোনিকাল বাংলা হেডলাইন */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {event.primarySource && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                  style={{ backgroundColor: event.primarySource.color || '#0284C7' }}
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>{event.primarySource.nameBn}</span>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {event.category}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 leading-tight">
              {event.canonical_bangla_title}
            </h1>

            {/* এআই ভয়েস ও মূল পোর্টাল বাটন */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              {event.articleUrl && (
                <a
                  href={sanitizeUrl(event.articleUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                  title="সরাসরি মূল সংবাদ পোর্টালে পড়ুন"
                >
                  <span>{event.primarySource?.nameBn || 'মূল সংবাদ পোর্টালে'} পড়ুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleToggleSpeech}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>ভয়েস রিডিং বন্ধ করুন</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>বাংলায় পুরো খবর শুনুন (AI Voice)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const text = encodeURIComponent(`*${event.canonical_bangla_title}*\n\n${event.summary_bangla}\n\nপড়ুন: ${event.articleUrl || window.location.href}`);
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span>WhatsApp শেয়ার</span>
              </button>
            </div>
          </div>

          {/* ফিচার ইমেজ — শুধুমাত্র মূল পোর্টালের আসল ফটো */}
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
            {hasRealImage ? (
              <img
                src={event.image_url}
                alt={event.canonical_bangla_title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <NewsImageFallback
                sourceName={event.primarySource?.nameBn}
                category={event.category}
                color={event.primarySource?.color || '#059669'}
              />
            )}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1.5">
              <span>{hasRealImage ? `📸 ${event.primarySource?.nameBn || 'মূল সংবাদ পোর্টাল'}-এর প্রকাশিত ছবি` : '📰 সংবাদ ডেস্ক গ্রাফিক কার্ড'}</span>
            </div>
          </div>

          {/* ৩ লাইনে এআই সারসংক্ষেপ বক্স */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white dark:from-emerald-950/40 dark:via-stone-900 dark:to-stone-900 border border-emerald-200/90 dark:border-emerald-800/60 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>এআই সহজ সারসংক্ষেপ (Quick Take)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300/50 dark:border-emerald-700">
                মূল কথা এক নজরে
              </span>
            </div>
            <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-sans leading-relaxed whitespace-pre-line space-y-1 bg-white/75 dark:bg-stone-950/60 p-3 rounded-xl border border-emerald-100 dark:border-stone-800">
              {event.ai_generated_summary || `• মূল খবর: ${event.canonical_bangla_title}\n• উৎস: ${event.primarySource?.nameBn || 'জাতীয় গণমাধ্যম'}\n• প্রকাশ: ${exactPublishedTime || elapsedLabel}`}
            </div>
          </div>

          {/* পূর্ণাঙ্গ সংবাদ প্রতিবেদন */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>মূল সংবাদ প্রতিবেদন ({event.primarySource?.nameBn || 'গণমাধ্যম'})</span>
              </h3>
              {event.articleUrl && (
                <a
                  href={sanitizeUrl(event.articleUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>আসল পোর্টালে পড়ুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="text-[15px] sm:text-base text-stone-800 dark:text-stone-200 font-serif leading-relaxed whitespace-pre-line space-y-3">
              <p>{event.full_news_content || event.summary_bangla}</p>
            </div>
          </div>

          {/* পরস্পরবিরোধী তথ্য থাকলে */}
          {event.conflicts && event.conflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>গুরুত্বপূর্ণ সংশোধনী নোট:</span>
              </div>
              {event.conflicts.map((conf, idx) => (
                <div key={idx} className="text-xs space-y-1 bg-white/80 dark:bg-stone-900/80 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                  <div className="font-bold text-rose-800 dark:text-rose-300">বিষয়: {conf.topic}</div>
                  <div className="text-stone-700 dark:text-stone-300">{conf.difference_bangla}</div>
                  <div className="text-emerald-800 dark:text-emerald-400 font-semibold">{conf.resolution}</div>
                </div>
              ))}
            </div>
          )}

          {/* ঘটনা পরম্পরা */}
          {event.timeline && event.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                ঘটনা পরম্পরা
              </h3>
              <div className="relative pl-6 space-y-4 border-l-2 border-emerald-200 dark:border-emerald-800 ml-2">
                {event.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-sm ring-2 ring-emerald-200 dark:ring-emerald-900" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          {step.time}
                        </span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">{step.title}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 mt-1">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.public_safety_warning && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>সতর্কতা:</strong> {event.public_safety_warning}</span>
            </div>
          )}

          {/* ফুটার অ্যাকশন */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>সরাসরি {event.primarySource?.nameBn || 'মূল পোর্টাল'} থেকে সংগৃহীত</span>
            </div>

            <div className="flex items-center gap-2">
              {event.articleUrl && (
                <a
                  href={sanitizeUrl(event.articleUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold transition-colors flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-700"
                >
                  <span>মূল প্রতিবেদন ↗</span>
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenCorrection(event);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold transition-colors flex items-center gap-1.5 border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>ভুল তথ্য রিপোর্ট</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
