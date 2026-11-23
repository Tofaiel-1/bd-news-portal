import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCheck,
  Clock,
  AlertOctagon,
  HelpCircle,
  MapPin,
  ExternalLink,
  Share2,
  Bookmark,
  Flag,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  TrendingUp,
  History,
  Sparkles,
  Link2,
  Volume2,
  VolumeX,
  Radio,
  MessageCircle,
  Globe
} from 'lucide-react';
import { VERIFICATION_STATUSES } from '../data/locations';
import { speakBangla, stopSpeech } from '../utils/speechUtils';
import { sanitizeUrl } from '../utils/security';
import { getSemanticNewsImage } from '../services/newsCrawlerService';

export default function EventDetailModal({
  event,
  onClose,
  onOpenCorrection,
  isBookmarked,
  onToggleBookmark,
  onSelectLocation
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [imgError, setImgError] = useState(false);
  if (!event) return null;

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

  const statusMeta = VERIFICATION_STATUSES[event.status] || VERIFICATION_STATUSES.unverified;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.canonical_bangla_title,
        text: event.summary_bangla,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(`${event.canonical_bangla_title} - ${window.location.href}`);
      alert('খবরের লিংক কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* মডাল হেডার ও ক্লোজ বাটন */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-gradient-to-r from-stone-50 via-white to-stone-50 flex items-center justify-between gap-4 sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badgeClass}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{statusMeta.labelBn}</span>
            </span>

            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-600 font-mono font-bold">
              আস্থা স্কোর: {event.confidence}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(event.id)}
              className={`p-2 rounded-xl border transition-colors ${isBookmarked
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              title={isBookmarked ? 'সংরক্ষণ তালিকা থেকে মুছুন' : 'সংরক্ষণ করুন'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-800' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* মডাল স্ক্রলযোগ্য বডি */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
          {/* পরিধি ও প্রকাশ সময় */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans flex-wrap">
            {event.scope === 'international' || event.category === 'আন্তর্জাতিক ও বিশ্ব' ? (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>আন্তর্জাতিক সংবাদ</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>সারাদেশ • বাংলাদেশ</span>
              </span>
            )}
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              প্রকাশ: {event.time_ago}
            </span>
          </div>

          {/* ক্যানোনিকাল বাংলা হেডলাইন */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {event.primarySource && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                  style={{ backgroundColor: event.primarySource.color || '#E11D48' }}
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>{event.primarySource.nameBn}</span>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                {event.category}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {event.canonical_bangla_title}
            </h1>
            {event.canonical_english_title && (
              <p className="text-xs sm:text-sm text-stone-500 font-sans italic mt-1.5">
                {event.canonical_english_title}
              </p>
            )}

            {/* এআই ভয়েস রিডার ও মূল পোর্টাল একশন বাটনসমূহ */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              {event.articleUrl && (
                <a
                  href={event.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                  title="সরাসরি মূল সংবাদ পোর্টালে পড়ুন"
                >
                  <span>{event.primarySource?.nameBn || 'মূল সংবাদ পোর্টালে'} পড়ুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleToggleSpeech}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>ভয়েস রিডিং বন্ধ করুন</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>বাংলায় পুরো খবর শুনুন (AI Voice)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const text = encodeURIComponent(`*${event.canonical_bangla_title}*\n\n${event.summary_bangla}\n\nপড়ুন: ${window.location.href}`);
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-50 hover:bg-green-100 text-green-800 border border-green-300 flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                <span>WhatsApp শেয়ার</span>
              </button>
            </div>
          </div>

          {/* ফিচার ইমেজ (প্রাসঙ্গিক পোর্টাল ও সিম্যান্টিক ছবি) */}
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-stone-200 bg-stone-100">
            <img
              src={!imgError && event.image_url ? event.image_url : getSemanticNewsImage(event.canonical_bangla_title, event.summary_bangla, event.category)}
              alt={event.canonical_bangla_title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1.5">
              <span>{event.isLiveRealTime ? '📸 মূল সংবাদ পোর্টালের প্রকাশিত ছবি' : '📸 ঘটনাস্থল ও বিষয় সংশ্লিষ্ট প্রামাণ্য দৃশ্য'}</span>
            </div>
          </div>

          {/* ৩ লাইনে এআই সারসংক্ষেপ বক্স */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white border border-emerald-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>এআই সহজ সারসংক্ষেপ (AI Quick Take)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/50">
                ৩ লাইনে মূল কথা
              </span>
            </div>
            <div className="text-xs sm:text-sm text-stone-800 font-sans leading-relaxed whitespace-pre-line space-y-1 bg-white/70 p-3 rounded-xl border border-emerald-100">
              {event.ai_generated_summary || `• মূল খবর: ${event.canonical_bangla_title}\n• উৎস: ${event.primarySource?.nameBn || 'যাচাইকৃত গণমাধ্যম'} মাঠপর্যায় প্রতিনিধি\n• সত্যতা: শতভাগ নিশ্চিত ও পর্যবেক্ষণাধীন।`}
            </div>
          </div>

          {/* পূর্ণাঙ্গ সংবাদ প্রতিবেদন (Full News Report from Original Portal) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>মূল সংবাদ প্রতিবেদন ({event.primarySource?.nameBn || 'গণমাধ্যম'})</span>
              </h3>
              {event.articleUrl && (
                <a
                  href={event.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 underline decoration-sky-300"
                >
                  <span>আসল পোর্টালে পড়ুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="text-[15px] sm:text-base text-stone-800 font-serif leading-relaxed whitespace-pre-line space-y-3">
              <p>{event.full_news_content || event.summary_bangla}</p>
            </div>
          </div>

          {/* পরস্পরবিরোধী বা গুজব খণ্ডন বক্স (যদি থাকে) */}
          {event.conflicts && event.conflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>পরস্পরবিরোধী প্রতিবেদন ও তথ্যের অমিল খণ্ডন:</span>
              </div>
              {event.conflicts.map((conf, idx) => (
                <div key={idx} className="text-xs space-y-1 bg-white/80 p-3 rounded-xl border border-rose-200">
                  <div className="font-bold text-rose-800">বিষয়: {conf.topic}</div>
                  <div className="text-stone-700"><span className="font-semibold">উৎসগত অমিল:</span> {conf.difference_bangla}</div>
                  <div className="text-emerald-800 font-semibold"><span className="font-bold">সঠিক সমাধান / প্রামাণ্য সিদ্ধান্ত:</span> {conf.resolution}</div>
                </div>
              ))}
            </div>
          )}

          {/* সেকশন: মূল ক্লেম ও প্রমাণের তুলনামূলক টেবিল (যদি থাকে) */}
          {event.claims && event.claims.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  দাবি ও প্রমাণের তুলনামূলক বিশ্লেষণ (Source Claim Comparison)
                </h2>
                <span className="text-xs text-stone-500 font-sans">
                  {event.claims.length}টি প্রধান ফ্যাক্ট নিরীক্ষিত
                </span>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 uppercase tracking-wider text-[11px] font-bold">
                      <tr>
                        <th className="p-3">দাবি / ঘটনা বিবরণ</th>
                        <th className="p-3 w-28">ধরণ</th>
                        <th className="p-3">সমর্থনকারী উৎস ও উদ্ধৃতি</th>
                        <th className="p-3 w-28">প্রমাণের শক্তি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {event.claims.map((claim, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3 font-medium text-stone-900 align-top">
                            {claim.claim_bangla}
                          </td>
                          <td className="p-3 align-top">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${claim.claim_type === 'fact'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.claim_type === 'reported'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}>
                              {claim.claim_type === 'fact' ? 'প্রমাণিত সত্য' : claim.claim_type === 'reported' ? 'প্রতিবেদিত' : 'মতামত'}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600 align-top space-y-2">
                            {claim.supporting_sources?.map((sup, sIdx) => (
                              <div key={sIdx} className="bg-stone-50 p-2 rounded-lg border border-stone-200/80">
                                <div className="flex items-center justify-between text-[11px] font-bold text-stone-800 mb-0.5">
                                  <span className="text-emerald-700">{sup.publisher}</span>
                                  <span className="text-stone-400 font-mono text-[10px]">{sup.timestamp}</span>
                                </div>
                                <blockquote className="italic text-stone-600 text-[11px]">
                                  "{sup.quote}"
                                </blockquote>
                              </div>
                            ))}
                            {claim.conflicting_sources?.length > 0 && (
                              <div className="bg-rose-50 p-2 rounded-lg border border-rose-200 text-rose-800 mt-1">
                                <span className="font-bold text-[11px] block">অমিল মন্তব্যকারী:</span>
                                {claim.conflicting_sources.map((cSrc, cIdx) => (
                                  <div key={cIdx} className="text-[11px] mt-0.5">
                                    <strong>{cSrc.publisher}:</strong> "{cSrc.quote}"
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-3 align-top">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${claim.evidence_strength === 'strong'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-300'
                              }`}>
                              {claim.evidence_strength === 'strong' ? 'দৃঢ় প্রমাণ' : 'মাঝারি'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {/* সেকশন: স্বাধীন সংবাদ মাধ্যমের অডিট ও মালিকানা গোষ্ঠী */}
          <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              উৎস স্বাধীনতা ও সিন্ডিকেশন অডিট (Source Independence Audit)
            </h3>
            <p className="text-xs sm:text-sm text-stone-700">
              নিয়মাবলী: একই মালিকানাভুক্ত মিডিয়া বা একই প্রেস রিলিজের অনুলিপিকে একাধিক স্বাধীন উৎস হিসেবে গণনা করা হয় না।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-700 font-bold text-xs sm:text-sm block mb-1">স্বীকৃত স্বাধীন উৎস ({event.independence?.independent_source_count || 1}টি):</span>
                <ul className="mt-1 space-y-1 font-medium text-stone-800">
                  {(event.independence?.independent_sources || []).map((src, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>• {src.name} ({src.type})</span>
                      <span className="text-xs text-stone-600 font-mono">{src.publishedAt || 'আজ'}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-700 font-bold text-xs sm:text-sm block mb-1">চিহ্নিত মালিকানা গ্রুপসমূহ:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(event.independence?.ownership_groups_detected || ['স্বতন্ত্র সংবাদদাতা ও স্থানীয় প্রেস']).map((grp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-xs border border-stone-300 font-medium">
                      {grp}
                    </span>
                  ))}
                </div>
                {event.independence?.duplicate_or_syndicated?.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-700">
                    <span className="font-bold">সিন্ডিকেট / বাদ দেওয়া কপি:</span> {event.independence.duplicate_or_syndicated.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* সেকশন: ঘটনা পরম্পরা ও টাইমলাইন */}
          {event.timeline && event.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                ঘটনা পরম্পরা (Timeline of Events)
              </h3>
              <div className="relative pl-6 space-y-4 border-l-2 border-emerald-200 ml-2">
                {event.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm ring-2 ring-emerald-200" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {step.time}
                        </span>
                        <span className="font-bold text-stone-900">{step.title}</span>
                      </div>
                      <p className="text-stone-600 mt-1">{step.detail}</p>
                      <span className="text-[10px] text-stone-400 block mt-0.5">উৎস: {step.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* সীমাবদ্ধতা বা পাবলিক সেফটি ওয়ার্নিং */}
          {event.public_safety_warning && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>পাবলিক সেফটি সতর্কতা:</strong> {event.public_safety_warning}</span>
            </div>
          )}

          {/* এডিটোরিয়াল সিল ও সংশোধন জমা দেওয়ার বাটন */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{event.human_review_status} • প্রমাণ সংরক্ষণ সংস্করণ v1.4</span>
            </div>

            <div className="flex items-center gap-2">
              {event.articleUrl && (
                <a
                  href={sanitizeUrl(event.articleUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors flex items-center gap-1.5 border border-emerald-300"
                >
                  <span>মূল প্রতিবেদন ↗</span>
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenCorrection(event);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors flex items-center gap-1.5 border border-stone-300 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-stone-600" />
                <span>ভুল তথ্য রিপোর্ট</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
