import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে' };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
              পৃষ্ঠাটি প্রদর্শনে সাময়িক সমস্যা হয়েছে
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              নেটওয়ার্ক বা ব্রাউজার ক্যাশের কারণে সংবাদ লোড হতে ব্যাঘাত ঘটেছে। অনুগ্রহ করে পুনরায় রিলোড করুন।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>পুনরায় চালু করুন</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
