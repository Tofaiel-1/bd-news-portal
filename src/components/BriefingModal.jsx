import React, { useState } from 'react';
import {
  X,
  Printer,
  Mail,
  CheckCircle2,
  FileText,
  Sunrise,
  Sunset
} from 'lucide-react';
import { getAccurateTimeAgo, getBanglaTodayDateString } from '../utils/dateUtils';

export default function BriefingModal({
  events = [],
  onClose
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [briefingType, setBriefingType] = useState('morning');
  const todayDateBn = getBanglaTodayDateString(new Date());

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="bg-white dark:bg-stone-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                দৈনিক জাতীয় ও আন্তর্জাতিক সংবাদ বুলেটিন
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                কর্মব্যস্ত পাঠকদের জন্য আজকের প্রধান সংবাদের এক নজরে সংকলন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="প্রিন্ট অথবা পিডিএফ সংরক্ষণ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              <span>প্রিন্ট / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* সকাল ও সন্ধ্যার বুলেটিন ট্যাব */}
        <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBriefingType('morning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                briefingType === 'morning'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Sunrise className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>সকালের বুলেটিন</span>
            </button>

            <button
              onClick={() => setBriefingType('evening')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                briefingType === 'evening'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Sunset className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>সন্ধ্যার রাউন্ডআপ</span>
            </button>
          </div>

          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            তারিখ: {todayDateBn}
          </span>
        </div>

        {/* বুলেটিন কনটেন্ট */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-stone-800 dark:text-stone-200 print:p-0">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              দৈনিক সংক্ষিপ্ত বুলেটিন
            </span>
            <h1 className="font-serif text-2xl font-black text-stone-900 dark:text-stone-50 mt-2">
              আমার বাংলাদেশ: {briefingType === 'morning' ? 'সকালের জাতীয় ও আন্তর্জাতিক বুলেটিন' : 'সন্ধ্যার বিশেষ সংবাদ রাউন্ডআপ'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              সারাদেশ এবং আন্তর্জাতিক শীর্ষ গণমাধ্যম থেকে সংগৃহীত সর্বশেষ তথ্যের সমন্বয়ে প্রস্তুতকৃত
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              আজকের নির্বাচিত প্রধান ৫টি সংবাদ:
            </h3>

            {events.slice(0, 5).map((evt, idx) => (
              <div key={evt.id || idx} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    {evt.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ • বাংলাদেশ'}
                  </span>
                  <span className="font-mono text-[11px]">{getAccurateTimeAgo(evt.published_at, evt.time_ago)}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  {evt.canonical_bangla_title}
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {evt.summary_bangla}
                </p>
                <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">প্রকাশ: {evt.primarySource?.nameBn || 'জাতীয় গণমাধ্যম'}</span>
                  <span>•</span>
                  <span>{evt.category}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white space-y-3 print:hidden">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h4 className="font-serif text-base font-bold text-white">
                প্রতিদিন সকালে আপনার ইমেইলে সংবাদ বুলেটিন পান
              </h4>
            </div>
            <p className="text-xs text-stone-300">
              কোনো স্প্যাম নয়; কেবল বাংলাদেশ ও বিশ্বের প্রতিদিনের গুরুত্বপূর্ণ সংবাদ।
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ধন্যবাদ! আপনার ইমেইল নিবন্ধিত হয়েছে।
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল ঠিকানা দিন..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  সাবস্ক্রাইব করুন
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
