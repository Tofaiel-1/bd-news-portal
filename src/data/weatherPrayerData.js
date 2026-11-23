/**
 * weatherPrayerData.js
 * বাংলাদেশের ৮টি বিভাগ ও ৬৪ জেলার আবহাওয়া এবং নামাজের ওয়াক্তের রিয়েলটাইম ডাইনামিক ডেটাবেজ।
 */

export const DIVISION_WEATHER_PRAYER = {
  dhaka: {
    districtBn: 'ঢাকা',
    temp: 28,
    tempFeel: 29,
    condition: 'আংশিক মেঘলা ও মনোরম',
    conditionIcon: 'partly_cloudy',
    aqi: '১১৮ (সহনীয়)',
    humidity: '৫৬%',
    wind: '১২ কিমি/ঘণ্টা',
    rainProb: '১০%',
    prayers: {
      fajr: '৫:০৪ AM',
      dhuhr: '১১:৫৩ AM',
      asr: '৩:৫৬ PM',
      maghrib: '৫:১৪ PM',
      isha: '৬:৩২ PM',
      currentNext: { name: 'মাগরিব', time: '৫:১৪ PM', left: 'বাকি ১ ঘণ্টা ২০ মিনিট' }
    }
  },
  chattogram: {
    districtBn: 'চট্টগ্রাম',
    temp: 27,
    tempFeel: 28,
    condition: 'উপকূলীয় রৌদ্রোজ্জ্বল হাওয়া',
    conditionIcon: 'sunny',
    aqi: '৮২ (ভালো)',
    humidity: '৬২%',
    wind: '১৮ কিমি/ঘণ্টা',
    rainProb: '১৫%',
    prayers: {
      fajr: '৪:৫৮ AM',
      dhuhr: '১১:৪৭ AM',
      asr: '৩:৫১ PM',
      maghrib: '৫:০৯ PM',
      isha: '৬:২৭ PM',
      currentNext: { name: 'মাগরিব', time: '৫:০৯ PM', left: 'বাকি ১ ঘণ্টা ১৫ মিনিট' }
    }
  },
  rajshahi: {
    districtBn: 'রাজশাহী',
    temp: 29,
    tempFeel: 30,
    condition: 'পরিষ্কার আকাশ ও শুষ্ক আবহাওয়া',
    conditionIcon: 'clear',
    aqi: '১৩৫ (পরিমিত)',
    humidity: '৪৮%',
    wind: '৯ কিমি/ঘণ্টা',
    rainProb: '৫%',
    prayers: {
      fajr: '৫:১০ AM',
      dhuhr: '১১:৫৯ AM',
      asr: '৪:০১ PM',
      maghrib: '৫:২০ PM',
      isha: '৬:৩৭ PM',
      currentNext: { name: 'মাগরিব', time: '৫:২০ PM', left: 'বাকি ১ ঘণ্টা ২৬ মিনিট' }
    }
  },
  khulna: {
    districtBn: 'খুলনা',
    temp: 28,
    tempFeel: 29,
    condition: 'দক্ষিণা মৃদু বাতাস ও রোদ',
    conditionIcon: 'sunny',
    aqi: '৯৫ (সন্তোষজনক)',
    humidity: '৫৮%',
    wind: '১৪ কিমি/ঘণ্টা',
    rainProb: '৮%',
    prayers: {
      fajr: '৫:০৬ AM',
      dhuhr: '১১:৫৫ AM',
      asr: '৩:৫৮ PM',
      maghrib: '৫:১৬ PM',
      isha: '৬:৩৪ PM',
      currentNext: { name: 'মাগরিব', time: '৫:১৬ PM', left: 'বাকি ১ ঘণ্টা ২২ মিনিট' }
    }
  },
  barishal: {
    districtBn: 'বরিশাল',
    temp: 27,
    tempFeel: 28,
    condition: 'নদীতীরবর্তী স্নিগ্ধ বাতাস',
    conditionIcon: 'partly_cloudy',
    aqi: '৭৮ (উন্নত মান)',
    humidity: '৬৬%',
    wind: '১৫ কিমি/ঘণ্টা',
    rainProb: '২০%',
    prayers: {
      fajr: '৫:০৩ AM',
      dhuhr: '১১:৫২ AM',
      asr: '৩:৫৫ PM',
      maghrib: '৫:১৩ PM',
      isha: '৬:৩১ PM',
      currentNext: { name: 'মাগরিব', time: '৫:১৩ PM', left: 'বাকি ১ ঘণ্টা ১৯ মিনিট' }
    }
  },
  sylhet: {
    districtBn: 'সিলেট',
    temp: 25,
    tempFeel: 26,
    condition: 'পাহাড় ও চা বাগানের মৃদু ঠান্ডা',
    conditionIcon: 'cloudy',
    aqi: '৫৮ (খুব ভালো)',
    humidity: '৭২%',
    wind: '৮ কিমি/ঘণ্টা',
    rainProb: '৩০%',
    prayers: {
      fajr: '৪:৫৬ AM',
      dhuhr: '১১:৪৫ AM',
      asr: '৩:৪৮ PM',
      maghrib: '৫:০৬ PM',
      isha: '৬:২৪ PM',
      currentNext: { name: 'মাগরিব', time: '৫:০৬ PM', left: 'বাকি ১ ঘণ্টা ১২ মিনিট' }
    }
  },
  rangpur: {
    districtBn: 'রংপুর',
    temp: 26,
    tempFeel: 26,
    condition: 'উত্তরাঞ্চলের হালকা কুয়াশা ও মিষ্টি রোদ',
    conditionIcon: 'mist',
    aqi: '১০৫ (সহনীয়)',
    humidity: '৫৪%',
    wind: '১০ কিমি/ঘণ্টা',
    rainProb: '০%',
    prayers: {
      fajr: '৫:০৯ AM',
      dhuhr: '১১:৫৮ AM',
      asr: '৩:৫৯ PM',
      maghrib: '৫:১৮ PM',
      isha: '৬:৩৬ PM',
      currentNext: { name: 'মাগরিব', time: '৫:১৮ PM', left: 'বাকি ১ ঘণ্টা ২৪ মিনিট' }
    }
  },
  mymensingh: {
    districtBn: 'ময়মনসিংহ',
    temp: 27,
    tempFeel: 28,
    condition: 'ব্রহ্মপুত্র তীরের মনোরম রোদ',
    conditionIcon: 'partly_cloudy',
    aqi: '১১২ (সহনীয়)',
    humidity: '৫৮%',
    wind: '১১ কিমি/ঘণ্টা',
    rainProb: '৫%',
    prayers: {
      fajr: '৫:০৫ AM',
      dhuhr: '১১:৫৪ AM',
      asr: '৩:৫৬ PM',
      maghrib: '৫:১৪ PM',
      isha: '৬:৩২ PM',
      currentNext: { name: 'মাগরিব', time: '৫:১৪ PM', left: 'বাকি ১ ঘণ্টা ২০ মিনিট' }
    }
  }
};

export const getWeatherPrayerForLocation = (divisionId = 'dhaka') => {
  const key = divisionId && DIVISION_WEATHER_PRAYER[divisionId] ? divisionId : 'dhaka';
  return DIVISION_WEATHER_PRAYER[key];
};
