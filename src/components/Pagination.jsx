import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toBanglaNumber } from './Header';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 24,
  onPageSizeChange,
  totalItems = 0,
  targetScrollId = 'news-feed-grid'
}) {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  // পৃষ্ঠার পরিসীমা হিসাব
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // পেজ পরিবর্তনের সাথে স্মুথ স্ক্রলিং
  const handlePageSelect = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);

    const targetEl = document.getElementById(targetScrollId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  // পেজ নম্বরের স্মার্ট তালিকা তৈরি (১, ২, ৩ ... ১০)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let left = Math.max(2, currentPage - 1);
      let right = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        left = 2;
        right = 4;
      } else if (currentPage >= totalPages - 2) {
        left = totalPages - 3;
        right = totalPages - 1;
      }

      if (left > 2) pages.push('...');
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-3 sm:p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 transition-all">
      {/* বাম পাশ: সংবাদের পরিসীমা ও মোট সংখ্যা */}
      <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans font-medium flex items-center gap-2">
        <span>
          <strong className="text-stone-900 dark:text-stone-100 font-mono font-bold">{toBanglaNumber(startItem)}</strong> - <strong className="text-stone-900 dark:text-stone-100 font-mono font-bold">{toBanglaNumber(endItem)}</strong> এর মধ্যে মোট <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{toBanglaNumber(totalItems)}</strong>টি সংবাদ
        </span>
        <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
        <span className="hidden sm:inline">
          (পৃষ্ঠা <strong className="text-stone-900 dark:text-stone-100 font-mono">{toBanglaNumber(currentPage)}</strong> / <strong className="text-stone-900 dark:text-stone-100 font-mono">{toBanglaNumber(totalPages)}</strong>)
        </span>
      </div>

      {/* মাঝের অংশ: পৃষ্ঠা ১, ২, ৩... বাটনসমূহ */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* পূর্ববর্তী বাটন */}
        <button
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-all border ${currentPage === 1
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-700 cursor-not-allowed opacity-60'
              : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 shadow-2xs cursor-pointer active:scale-95'
            }`}
          title="পূর্ববর্তী পৃষ্ঠা"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </button>

        {/* পৃষ্ঠা নম্বরসমূহ */}
        {getPageNumbers().map((num, idx) => {
          if (num === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-stone-400 dark:text-stone-600 text-xs font-mono font-bold">
                ...
              </span>
            );
          }

          const isCurrent = num === currentPage;
          return (
            <button
              key={`page-${num}`}
              onClick={() => handlePageSelect(num)}
              className={`min-w-[34px] h-[34px] rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center border cursor-pointer ${isCurrent
                  ? 'bg-stone-900 dark:bg-emerald-700 text-white border-stone-950 dark:border-emerald-600 shadow-md ring-2 ring-emerald-500/30 scale-105'
                  : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                }`}
            >
              {toBanglaNumber(num)}
            </button>
          );
        })}

        {/* পরবর্তী বাটন */}
        <button
          onClick={() => handlePageSelect(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-all border ${currentPage === totalPages
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-700 cursor-not-allowed opacity-60'
              : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 shadow-2xs cursor-pointer active:scale-95'
            }`}
          title="পরবর্তী পৃষ্ঠা"
        >
          <span className="hidden sm:inline">পরবর্তী</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ডান পাশ: প্রতি পৃষ্ঠায় সংবাদের সংখ্যা নির্বাচক (ডিফল্ট ২৪টি) */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium">
          <span className="whitespace-nowrap">প্রতি স্ক্রিনে:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-bold font-mono text-stone-800 dark:text-stone-200 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <option value={24}>২৪টি (অটো)</option>
            <option value={12}>১২টি</option>
            <option value={18}>১৮টি</option>
            <option value={36}>৩৬টি</option>
            <option value={48}>৪৮টি</option>
          </select>
        </div>
      )}
    </div>
  );
}
