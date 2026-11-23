import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Mail, 
  CheckCircle2, 
  FileText, 
  Sunrise, 
  Sunset, 
  MapPin, 
  Sparkles,
  Download
} from 'lucide-react';

export default function BriefingModal({
  events = [],
  selectedLocation,
  onClose
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [briefingType, setBriefingType] = useState('morning'); // 'morning' | 'evening'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                দৈনিক জাতীয় ও আন্তর্জাতিক সংবাদ বুলেটিন
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                কর্মব্যস্ত পাঠক ও প্রবাসীদের জন্য দিনভিত্তিক যাচাইকৃত সংক্ষিপ্ত তথ্য
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              title="প্রিন্ট অথবা পিডিএফ সংরক্ষণ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>প্রিন্ট / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* সকাল ও সন্ধ্যার বুলেটিন সুইচ ট্যাব */}
        <div className="px-5 py-3 border-b border-stone-200 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBriefingType('morning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                briefingType === 'morning'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sunrise className="w-4 h-4 text-amber-600" />
              <span>সকালের বুলেটিন (০৮:০০ AM)</span>
            </button>

            <button
              onClick={() => setBriefingType('evening')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                briefingType === 'evening'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sunset className="w-4 h-4 text-indigo-600" />
              <span>সন্ধ্যার সারসংক্ষেপ ও ফ্যাক্ট-চেক</span>
            </button>
          </div>

          <span className="text-xs text-stone-400 font-mono hidden sm:inline">
            তারিখ: ১৮ নভেম্বর ২০২৬
          </span>
        </div>

        {/* বুলেটিন কনটেন্ট ভিউ */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-stone-800 print:p-0">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              আমোদ ও আস্থাশীল সারসংক্ষেপ
            </span>
            <h1 className="font-serif text-2xl font-black text-stone-900 mt-2">
              আমার বাংলাদেশ: {briefingType === 'morning' ? 'সকালের জাতীয় ও আন্তর্জাতিক বুলেটিন' : 'সন্ধ্যার ফ্যাক্ট-চেক ও উন্নয়ন রাউন্ডআপ'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              সারাদেশ এবং আন্তর্জাতিক শীর্ষ গণমাধ্যম থেকে প্রাপ্ত ক্রস-ভেরিফাইড তথ্যের সমন্বয়ে প্রস্তুতকৃত
            </p>
          </div>

          {/* প্রধান হাইলাইটস তালিকা */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              আজকের নির্বাচিত যাচাইকৃত ৩টি প্রধান সংবাদ:
            </h3>

            {events.slice(0, 3).map((evt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    {evt.scope === 'international' ? '🌍 আন্তর্জাতিক' : '🇧🇩 সারাদেশ • বাংলাদেশ'}
                  </span>
                  <span className="font-mono text-[11px]">{evt.time_ago}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900">
                  {evt.canonical_bangla_title}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {evt.summary_bangla}
                </p>
                <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-2">
                  <span className="font-medium text-emerald-700 font-mono">আস্থা: {evt.confidence}%</span>
                  <span>•</span>
                  <span>উৎস: {evt.independence.independent_sources.map(s => s.name).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ইমেইল সাবস্ক্রিপশন ফরম */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white space-y-3 print:hidden">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h4 className="font-serif text-base font-bold text-white">
                প্রতিদিন সকালে আপনার ইমেইলে সংবাদ বুলেটিন পান
              </h4>
            </div>
            <p className="text-xs text-stone-300">
              কোনো স্প্যাম নয়; কেবল বাংলাদেশ ও বিশ্বের প্রতিদিনের গুরুত্বপূর্ণ যাচাইকৃত সংবাদ।
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ধন্যবাদ! আপনার ইমেইল সফলভাবে নিবন্ধিত হয়েছে। প্রতিদিন সকাল ৮টায় বুলেটিন পৌঁছে যাবে।
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
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
