import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle, Link2, Send } from 'lucide-react';
import { sanitizeText, isRateLimited } from '../utils/security';

export default function CorrectionModal({ event, onClose }) {
  const [claimDifference, setClaimDifference] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('পাঠক');
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRateLimited('correction_submission', 3, 30000)) {
      setRateLimitError('অতিরিক্ত আবেদন চিহ্নিত হয়েছে। অনুগ্রহ করে ৩০ সেকেন্ড পর পুনরায় চেষ্টা করুন।');
      return;
    }
    const cleanDiff = sanitizeText(claimDifference, 500);
    if (!cleanDiff) return;
    setRateLimitError('');
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                ভুল তথ্য বা সংশোধন রিপোর্ট করুন
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                সম্পাদকীয় বোর্ড কর্তৃক সরাসরি পর্যালোচিত হবে
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans">
          {event && (
            <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">সংশ্লিষ্ট সংবাদ:</span>
              <div className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm mt-0.5">
                {event.canonical_bangla_title}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {event.scope === 'international' ? '🌍 আন্তর্জাতিক সংবাদ' : '🇧🇩 সারাদেশ (বাংলাদেশ)'}
              </div>
            </div>
          )}

          {submitted ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-emerald-950 dark:text-emerald-100">
                আপনার সংশোধন প্রস্তাব সফলভাবে গৃহীত হয়েছে
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                আমাদের বার্তা ডেস্ক মূল সূত্রের সাথে মিলিয়ে সংবাদটি হালনাগাদ করবে। সহযোগিতা করার জন্য ধন্যবাদ।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {rateLimitError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{rateLimitError}</span>
                </div>
              )}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  কোন তথ্যে ভুল বা অসংগতি রয়েছে? <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows="3"
                  value={claimDifference}
                  onChange={(e) => setClaimDifference(e.target.value)}
                  placeholder="যেমন: সঠিক তথ্য বা সময় সংশোধনের বিবরণ লিখুন..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  প্রমাণ হিসেবে কোনো সোর্স লিংক আছে কি? (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">আপনার নাম (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="নাম..."
                    className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">আপনার পরিচয়</label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs outline-none"
                  >
                    <option value="পাঠক">সাধারণ পাঠক</option>
                    <option value="স্থানীয় বাসিন্দা">স্থানীয় বাসিন্দা</option>
                    <option value="সাংবাদিক">সাংবাদিক</option>
                    <option value="কর্মকর্তা">প্রশাসনিক কর্মকর্তা</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-emerald-600 hover:bg-stone-800 dark:hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রিপোর্ট জমা দিন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
