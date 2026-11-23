/**
 * speechUtils.js
 * ব্রাউজারের ওয়েব স্পিচ এপিআই (Web Speech API) ব্যবহার করে বাংলায় সংবাদ পড়ে শোনানোর ইঞ্জিন।
 */

let activeUtterance = null;

export const speakBangla = (text, onStart, onEnd) => {
  if (!('speechSynthesis' in window)) {
    alert('দুঃখিত, আপনার ব্রাউজার স্পিচ সিন্থেসিস সমর্থন করে না।');
    return;
  }

  // পূর্ববর্তী স্পিচ বন্ধ করা
  window.speechSynthesis.cancel();

  // পরিচ্ছন্ন টেক্সট তৈরি
  const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'bn-BD';
  utterance.rate = 0.95; // স্বাভাবিক পাঠের গতি
  utterance.pitch = 1.0;

  // উপলব্ধ বাংলা ভয়েস খোঁজা
  const voices = window.speechSynthesis.getVoices();
  const banglaVoice = voices.find(v => v.lang === 'bn-BD' || v.lang === 'bn-IN' || v.lang.startsWith('bn'));
  if (banglaVoice) {
    utterance.voice = banglaVoice;
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};
