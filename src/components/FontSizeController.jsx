import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

export const FONT_SIZES = [
  { id: 'normal', scale: 1, label: 'স্বাভাবিক', short: 'A' },
  { id: 'large', scale: 1.15, label: 'বড়', short: 'A+' },
  { id: 'xlarge', scale: 1.3, label: 'অনেক বড়', short: 'A++' }
];

export default function FontSizeController() {
  const [currentSize, setCurrentSize] = useState(() => {
    try {
      return localStorage.getItem('bd_font_size') || 'normal';
    } catch {
      return 'normal';
    }
  });

  useEffect(() => {
    const selected = FONT_SIZES.find(s => s.id === currentSize) || FONT_SIZES[0];
    document.documentElement.style.setProperty('--app-font-scale', selected.scale);
    try {
      localStorage.setItem('bd_font_size', currentSize);
    } catch {}
  }, [currentSize]);

  return (
    <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-full border border-stone-200 dark:border-stone-700 shadow-inner">
      <span className="pl-2 pr-1 text-stone-400 text-xs flex items-center" title="লেখার সাইজ পরিবর্তন">
        <Type className="w-3.5 h-3.5" />
      </span>
      {FONT_SIZES.map(item => {
        const isActive = currentSize === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentSize(item.id)}
            title={`লেখার আকার: ${item.label}`}
            className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            {item.short}
          </button>
        );
      })}
    </div>
  );
}
