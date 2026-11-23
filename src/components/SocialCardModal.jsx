import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  MapPin, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { toBanglaNumber } from './Header';

export default function SocialCardModal({
  event,
  isOpen,
  onClose
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const scopeLabel = event.scope === 'international' ? 'আন্তর্জাতিক (বিশ্ব সংবাদ)' : 'সারাদেশ (বাংলাদেশ)';
  const scopeBadge = event.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ';

  const copyNewsText = () => {
    const text = `📰 *${event.canonical_bangla_title}*\n\n📍 পরিধি: ${scopeLabel}\n⏱️ সময়: ${event.time_ago}\n\n📌 বিস্তারিত:\n${event.summary_bangla}\n\n🔗 পড়ুন: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`📰 *${event.canonical_bangla_title}*\n\n📍 ${scopeLabel}\n⏱️ ${event.time_ago}\n\n${event.summary_bangla}\n\n🔗 ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
        
        {/* হেডার */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif text-sm font-bold text-stone-900">
              সোশ্যাল ফটো কার্ড প্রিভিউ (ফেসবুক ও হোয়াটসঅ্যাপে শেয়ার উপযোগী)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ভিজ্যুয়াল ফটো কার্ড (যা শেয়ার হবে) */}
        <div className="p-4 sm:p-6 bg-stone-100/60">
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white rounded-2xl overflow-hidden shadow-xl border border-stone-800">
            {/* ফটো সেকশন */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={event.image_url}
                alt={event.canonical_bangla_title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              {/* টপ ব্যাজ */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>যাচাইকৃত সত্য</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md">
                  {scopeBadge}
                </span>
              </div>

              {/* ওয়াটারমার্ক লোগো */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-emerald-300 text-[10px] font-bold font-mono">
                AMAR BANGLADESH
              </div>

              {/* শিরোনাম ওভারলে */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase mb-1 inline-block">
                  {event.category}
                </span>
                <h4 className="font-serif text-base sm:text-lg font-black leading-snug text-white drop-shadow-md">
                  {event.canonical_bangla_title}
                </h4>
              </div>
            </div>

            {/* কার্ডের নিচের টেক্সট ও ফুটনোট */}
            <div className="p-4 bg-stone-950 space-y-2.5 border-t border-white/10">
              <p className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed line-clamp-3">
                {event.summary_bangla}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>উৎস: {event.primarySource?.nameBn || 'যাচাইকৃত নেটওয়ার্ক'}</span>
                </div>
                <span>📅 {event.time_ago}</span>
              </div>
            </div>
          </div>
        </div>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-stone-500 font-sans">
            কার্ডটি সহজেই বন্ধুদের সাথে শেয়ার করুন
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyNewsText}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
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
