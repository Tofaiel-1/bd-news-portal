import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { getAccurateTimeAgo } from '../utils/dateUtils';
import NewsImageFallback from './NewsImageFallback';

export default function SocialCardModal({
  event,
  isOpen,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [event?.id, event?.image_url]);

  if (!isOpen || !event) return null;

  const scopeLabel = event.scope === 'international' ? 'আন্তর্জাতিক (বিশ্ব সংবাদ)' : 'সারাদেশ (বাংলাদেশ)';
  const scopeBadge = event.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ';
  const elapsedLabel = getAccurateTimeAgo(event.published_at, event.time_ago);
  const shareUrl = event.articleUrl || window.location.href;
  const hasRealImage = Boolean(event.image_url) && !imgError;

  const copyNewsText = () => {
    const text = `📰 *${event.canonical_bangla_title}*\n\n📍 পরিধি: ${scopeLabel}\n⏱️ সময়: ${elapsedLabel}\n\n📌 বিস্তারিত:\n${event.summary_bangla}\n\n🔗 পড়ুন: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`📰 *${event.canonical_bangla_title}*\n\n📍 ${scopeLabel}\n⏱️ ${elapsedLabel}\n\n${event.summary_bangla}\n\n🔗 ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
      >
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              সোশ্যাল ফটো কার্ড প্রিভিউ (ফেসবুক ও হোয়াটসঅ্যাপে শেয়ার উপযোগী)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-stone-100/60 dark:bg-stone-950/60">
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white rounded-2xl overflow-hidden shadow-xl border border-stone-800">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>যাচাইকৃত সত্য</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md">
                  {scopeBadge}
                </span>
              </div>

              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-emerald-300 text-[10px] font-bold font-mono">
                AMAR BANGLADESH
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase mb-1 inline-block">
                  {event.category}
                </span>
                <h4 className="font-serif text-base sm:text-lg font-black leading-snug text-white drop-shadow-md">
                  {event.canonical_bangla_title}
                </h4>
              </div>
            </div>

            <div className="p-4 bg-stone-950 space-y-2.5 border-t border-white/10">
              <p className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed line-clamp-3">
                {event.summary_bangla}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>উৎস: {event.primarySource?.nameBn || 'জাতীয় গণমাধ্যম'}</span>
                </div>
                <span>🕒 {elapsedLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-sans">
            কার্ডটি সহজেই বন্ধুদের সাথে শেয়ার করুন
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyNewsText}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'টেক্সট কপি'}</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে পাঠান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
