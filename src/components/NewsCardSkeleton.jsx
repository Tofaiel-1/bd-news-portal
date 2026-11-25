import React from 'react';

export function HeroSkeleton() {
  return (
    <section className="w-full space-y-4 animate-pulse">
      <div className="h-8 w-72 bg-stone-200 dark:bg-stone-800 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="aspect-[16/9] bg-stone-200 dark:bg-stone-800" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-stone-200 dark:bg-stone-800 rounded-lg" />
            <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded-lg" />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 flex gap-3">
              <div className="w-24 h-20 rounded-2xl bg-stone-200 dark:bg-stone-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-4 w-5/6 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonCardGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        >
          <div className="h-36 bg-stone-200 dark:bg-stone-800" />
          <div className="p-3.5 space-y-2.5">
            <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-4 w-4/5 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-3 w-2/3 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
