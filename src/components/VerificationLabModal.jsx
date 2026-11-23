import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode2, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Clock,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

const PRESET_CASES = [
  {
    id: 'case-1',
    name: 'নাফ নদীতে ট্রলার দুর্ঘটনা ও পরস্পরবিরোধী গুজবের ফ্যাক্ট-চেক',
    targetLocation: { division: 'চট্টগ্রাম', district: 'কক্সবাজার', upazila: 'টেকনাফ', union: 'শাহপরীর দ্বীপ' },
    articles: [
      {
        article_id: 'art-001',
        source_id: 'src-coastguard',
        publisher_name: 'বাংলাদেশ কোস্টগার্ড গণসংযোগ উইং',
        publisher_ownership_group: 'সরকারি নিরাপত্তা সংস্থা',
        canonical_url: 'https://coastguard.gov.bd/press/naf-rescue',
        published_at: '2026-11-18T11:10:00+06:00',
        language: 'bn',
        title: 'নাফ নদীতে ইঞ্জিন বিকল হয়ে চরে আটকে পড়া বোট থেকে ৪ মাঝিকে জীবিত উদ্ধার',
        excerpt: 'কোস্টগার্ড পূর্বাঞ্চলের টহল দল দ্রুত অভিযান চালিয়ে চারজনকে অক্ষত অবস্থায় উদ্ধার করে। কোনো মৃত্যুর ঘটনা ঘটেনি।',
        location_mentions: ['টেকনাফ', 'শাহপরীর দ্বীপ']
      },
      {
        article_id: 'art-002',
        source_id: 'src-bdnews24',
        publisher_name: 'বিডিনিউজ২৪ ডটকম',
        publisher_ownership_group: 'স্বাধীন ডিজিটাল প্রেস',
        canonical_url: 'https://bdnews24.com/bangladesh/teknaf-rescue',
        published_at: '2026-11-18T11:25:00+06:00',
        language: 'bn',
        title: 'টেকনাফে চরে আটকে পড়া ফিশিং বোট উদ্ধার, সুস্থ আছেন মাঝিরা: পুলিশ',
        excerpt: 'টেকনাফ থানার ভারপ্রাপ্ত কর্মকর্তা জানিয়েছেন সোশ্যাল মিডিয়ায় ছড়ানো ১২ জন নিখোঁজের তথ্য গুজব।',
        location_mentions: ['কক্সবাজার', 'টেকনাফ']
      },
      {
        article_id: 'art-003',
        source_id: 'src-viral-portal',
        publisher_name: 'লোকাল ক্রাইম ওয়াচ পেজ',
        publisher_ownership_group: 'অজ্ঞাত সোশ্যাল পেজ',
        canonical_url: 'https://facebook.com/groups/local-crime/posts/102',
        published_at: '2026-11-18T10:00:00+06:00',
        language: 'bn',
        title: 'শাহপরীর দ্বীপে ট্রলারডুবি, ১২ জন নিখোঁজ থাকার আশঙ্কা',
        excerpt: 'আজ সকালে ট্রলার ডুবে সবাই ভেসে গেছে বলে স্থানীয়রা দাবি করেছেন।',
        location_mentions: ['শাহপরীর দ্বীপ']
      }
    ]
  },
  {
    id: 'case-2',
    name: 'সাভার বাইপাস সড়ক উদ্বোধন ও ট্রাফিক স্বাভাবিকীকরণ',
    targetLocation: { division: 'ঢাকা', district: 'ঢাকা', upazila: 'সাভার', union: 'হেমায়েতপুর' },
    articles: [
      {
        article_id: 'art-101',
        source_id: 'src-bss',
        publisher_name: 'বাংলাদেশ সংবাদ সংস্থা (BSS)',
        publisher_ownership_group: 'রাষ্ট্রীয় সংবাদ মাধ্যম',
        canonical_url: 'https://bssnews.net/savar-bypass',
        published_at: '2026-11-18T08:45:00+06:00',
        language: 'bn',
        title: 'সাভারে নবনির্মিত ৪-লেন বাইপাসে যান চলাচল শুরু, কমেছে যানজট',
        excerpt: 'সড়ক ও জনপথ অধিদপ্তরের তত্ত্বাবধানে নির্মিত সিঅ্যান্ডবি বাইপাস আজ সকাল থেকে কার্যকর হয়েছে।',
        location_mentions: ['সাভার', 'হেমায়েতপুর', 'ঢাকা']
      },
      {
        article_id: 'art-102',
        source_id: 'src-prothom-alo',
        publisher_name: 'দৈনিক প্রথম আলো',
        publisher_ownership_group: 'ট্রান্সকম গ্রুপ',
        canonical_url: 'https://prothomalo.com/bangladesh/savar-bypass',
        published_at: '2026-11-18T09:15:00+06:00',
        language: 'bn',
        title: 'সাভার বাজারে জট নিরসনে নতুন বাইপাস উন্মুক্ত',
        excerpt: 'হাইওয়ে পুলিশের তথ্যমতে সাভার বাজার অংশের যানবাহনের চাপ ৬০ শতাংশ হ্রাস পেয়েছে।',
        location_mentions: ['সাভার', 'ঢাকা']
      }
    ]
  }
];

export default function VerificationLabModal({ onClose }) {
  const [selectedCase, setSelectedCase] = useState(PRESET_CASES[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const steps = [
    'দাবি ও ফ্যাক্ট নিষ্কাশন (Claim Extraction)',
    'ভৌগোলিক অবস্থান স্বাভাবিকীকরণ (Location Normalization)',
    'উৎস স্বাধীনতা ও সিন্ডিকেশন অডিট (Independence Audit)',
    'ইভেন্ট ক্লাস্টারিং ও বিশ্বাসযোগ্যতা স্কোরিং (Scoring & JSON Report)'
  ];

  const handleRunVerification = () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setTimeout(() => {
          setActiveStep(4);
          setIsVerifying(false);

          if (selectedCase.id === 'case-1') {
            setVerificationResult({
              event: {
                event_id: 'evt-naf-2026-verif',
                canonical_bangla_title: 'টেকনাফে নাফ নদীতে ট্রলারের ইঞ্জিন বিকল, ৪ মাঝিকে অক্ষত উদ্ধার করল কোস্টগার্ড',
                summary_bangla: 'কোস্টগার্ড পূর্বাঞ্চল ও টেকনাফ থানা নিশ্চিত করেছে নাফ নদীতে বোট চরে আটকেছিল, ৪ মাঝিকে জীবিত উদ্ধার করা হয়েছে। ১২ জন নিখোঁজের দাবিটি সম্পূর্ণ ভিত্তিহীন গুজব।',
                category: 'অপরাধ ও দুর্ঘটনা',
                target_location: {
                  division: 'চট্টগ্রাম',
                  district: 'কক্সবাজার',
                  upazila: 'টেকনাফ',
                  union: 'শাহপরীর দ্বীপ',
                  confidence: 95
                },
                event_time: '2026-11-18T11:10:00+06:00',
                status: 'conflicting_reports',
                confidence: 48,
                freshness: 'breaking',
                official_confirmation_required: true
              },
              independence: {
                independent_source_count: 2,
                independent_sources: ['src-coastguard', 'src-bdnews24'],
                duplicate_or_syndicated_article_ids: ['art-003'],
                ownership_groups_detected: ['সরকারি নিরাপত্তা সংস্থা', 'স্বাধীন ডিজিটাল প্রেস']
              },
              claims: [
                {
                  claim_bangla: 'কোস্টগার্ড ৪ মাঝিকে অক্ষত উদ্ধার করেছে, কোনো প্রাণহানি হয়নি।',
                  claim_type: 'fact',
                  evidence_strength: 'strong',
                  supporting_article_ids: ['art-001', 'art-002'],
                  conflicting_article_ids: ['art-003']
                },
                {
                  claim_bangla: '১২ জন নিখোঁজ হওয়ার দাবি ভিত্তিহীন ও ফেসবুক গুজব।',
                  claim_type: 'fact',
                  evidence_strength: 'strong',
                  supporting_article_ids: ['art-001', 'art-002']
                }
              ],
              conflicts: [
                {
                  topic: 'হতাহতের সংখ্যা ও নিখোঁজের দাবি',
                  article_ids: ['art-001', 'art-003'],
                  difference_bangla: 'অননুমোদিত সোশ্যাল পেজ ১২ জন নিখোঁজের দাবি করেছিল, বিপরীতে কোস্টগার্ড ও পুলিশ নিশ্চিত করেছে মাত্র ৪ জন ছিল এবং সবাই জীবিত।',
                  resolution: 'কোস্টগার্ডের আনুষ্ঠানিক সংবাদ বিবরণী অনুযায়ী গুজব খারিজ করা হয়েছে।'
                }
              ],
              limitations: ['জোয়ার-ভাটা পরিবর্তনের সময় জেলেদের সতর্ক থাকার নির্দেশ রয়েছে।'],
              public_safety_warning: 'অযাচাইকৃত সোশ্যাল মিডিয়া পোস্ট বিশ্বাস না করার অনুরোধ জানিয়েছে স্থানীয় প্রশাসন।',
              ai_generated_summary: 'প্রমাণিত তথ্যের ভিত্তিতে ১২ জন নিহতের দাবি সম্পূর্ণ অসত্য এবং ৪ জন মাঝির সুস্থতার বিষয়টি সরকারি ও সাংবাদিক সূত্রে নিশ্চিত।',
              human_review_required: true
            });
          } else {
            setVerificationResult({
              event: {
                event_id: 'evt-savar-2026-verif',
                canonical_bangla_title: 'সাভারে নবনির্মিত ৪-লেন বাইপাস আনুষ্ঠানিকভাবে কার্যকর, যানজট ৬০% হ্রাস',
                summary_bangla: 'সাভারের হেমায়েতপুর-সিঅ্যান্ডবি বাইপাস সড়ক সকাল থেকে উন্মুক্ত। বাসস ও প্রথম আলোর প্রতিবেদনে যান চলাচল স্বাভাবিক থাকার বিষয়টি নিশ্চিত।',
                category: 'যানজট ও পরিবহন',
                target_location: {
                  division: 'ঢাকা',
                  district: 'ঢাকা',
                  upazila: 'সাভার',
                  union: 'হেমায়েতপুর',
                  confidence: 98
                },
                event_time: '2026-11-18T08:45:00+06:00',
                status: 'officially_confirmed',
                confidence: 96,
                freshness: 'recent',
                official_confirmation_required: false
              },
              independence: {
                independent_source_count: 2,
                independent_sources: ['src-bss', 'src-prothom-alo'],
                duplicate_or_syndicated_article_ids: [],
                ownership_groups_detected: ['রাষ্ট্রীয় সংবাদ মাধ্যম', 'ট্রান্সকম গ্রুপ']
              },
              claims: [
                {
                  claim_bangla: 'নবনির্মিত ৪-লেন বাইপাস আজ সকাল থেকে কার্যকর হয়েছে।',
                  claim_type: 'fact',
                  evidence_strength: 'strong',
                  supporting_article_ids: ['art-101', 'art-102']
                }
              ],
              conflicts: [],
              limitations: ['বৃষ্টির মৌসুমে ড্রেনেজ ব্যবস্থা নিয়মিত পর্যবেক্ষণ প্রয়োজন।'],
              public_safety_warning: null,
              ai_generated_summary: 'উভয় স্বাধীন সূত্র সরাসরি প্রকল্প বাস্তবায়ন ও যানবাহনের গতিশীলতা প্রত্যক্ষ করে সংবাদ প্রদান করেছে।',
              human_review_required: false
            });
          }
        }, 600);
      }, 600);
    }, 600);
  };

  const handleCopyJson = () => {
    if (!verificationResult) return;
    navigator.clipboard.writeText(JSON.stringify(verificationResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ল্যাব হেডার */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">
                  বাংলাদেশ সংবাদ সত্যতা যাচাই ল্যাব
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Engine v2.0
                </span>
              </div>
              <p className="text-xs text-stone-400">
                AI ভেরিফিকেশন স্পেসিফিকেশন ও মাল্টি-সোর্স নিরপেক্ষতা নিরীক্ষা
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ল্যাব বডি */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* টেস্ট কেস সিলেক্টর */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              যাচাইকরণের জন্য ঘটনা নির্বাচন করুন (Pre-loaded News Cases):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PRESET_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCase(c);
                    setVerificationResult(null);
                    setActiveStep(0);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedCase.id === c.id
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 text-stone-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-stone-900 mb-1">{c.name}</div>
                  <div className="text-stone-500 text-[11px] flex items-center gap-2">
                    <span>📍 {c.targetLocation.upazila}, {c.targetLocation.district}</span>
                    <span>•</span>
                    <span>{c.articles.length}টি নিবন্ধ</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ইনপুট ডাটা প্রাকদর্শন */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
            <div className="flex items-center justify-between text-stone-700 font-bold">
              <span>ইনজেস্টেড আর্টিকেলের তালিকা ({selectedCase.articles.length}টি উৎস)</span>
              <span className="text-[11px] text-emerald-700">লক্ষ্য: {selectedCase.targetLocation.upazila}, {selectedCase.targetLocation.district}</span>
            </div>

            <div className="space-y-2">
              {selectedCase.articles.map((art, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-stone-200 text-stone-700">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-stone-900">{art.publisher_name}</span>
                    <span className="text-stone-400 font-mono text-[10px]">{art.publisher_ownership_group}</span>
                  </div>
                  <div className="font-serif font-semibold text-stone-800">{art.title}</div>
                  <p className="text-stone-500 text-[11px] mt-0.5 italic">"{art.excerpt}"</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-xs"
            >
              {isVerifying ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>ভেরিফিকেশন পাইপলাইন বিশ্লেষণ চলছে...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>ভেরিফিকেশন ইঞ্জিন টেস্ট রান শুরু করুন</span>
                </>
              )}
            </button>
          </div>

          {/* প্রসেসিং স্টেপস ইন্ডিকেটর */}
          {(isVerifying || verificationResult) && (
            <div className="p-4 rounded-xl bg-stone-900 text-white space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-emerald-400 text-[11px]">
                ভেরিফিকেশন প্রসেসিং ধাপসমূহ:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {steps.map((st, i) => {
                  const isDone = activeStep > i + 1 || verificationResult;
                  const isCurrent = activeStep === i + 1 && !verificationResult;
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border text-[11px] flex items-center gap-2 transition-all ${
                        isDone
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                          : isCurrent
                          ? 'bg-stone-800 border-emerald-400 text-white animate-pulse'
                          : 'bg-stone-950/40 border-stone-800 text-stone-500'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDone ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span className="leading-tight">{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* আউটপুট ও স্ট্রাকচার্ড JSON রেজাল্ট */}
          {verificationResult && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-bold text-xs">
                      স্ট্যাটাস: {verificationResult.event.status}
                    </span>
                    <span className="font-mono font-bold text-stone-700">
                      আস্থা মাত্রা: {verificationResult.event.confidence}%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    স্বাধীন উৎস: {verificationResult.independence.independent_source_count}টি
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {verificationResult.event.canonical_bangla_title}
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  {verificationResult.event.summary_bangla}
                </p>

                {verificationResult.conflicts?.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold block">খণ্ডনকৃত অসঙ্গতি / ফ্যাক্ট-চেক সিদ্ধান্ত:</span>
                    <p className="mt-1">{verificationResult.conflicts[0].resolution}</p>
                  </div>
                )}
              </div>

              {/* JSON এক্সপোর্ট বক্স */}
              <div className="p-4 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4" />
                    bangladesh-news-verification-prompt Structured JSON Output
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1 text-[11px] font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'কপি হয়েছে' : 'JSON কপি করুন'}
                  </button>
                </div>
                <pre className="p-3 bg-black/60 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-300 max-h-60 scrollbar-thin">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
