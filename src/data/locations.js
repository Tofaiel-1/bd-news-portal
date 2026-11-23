// বাংলাদেশ প্রশাসনিক ভৌগোলিক ডাটাবেজ (৮টি বিভাগ, ৬৪টি জেলা ও প্রধান উপজেলাসমূহ)

export const DIVISIONS = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', districtsCount: 13 },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', districtsCount: 11 },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', districtsCount: 8 },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', districtsCount: 10 },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', districtsCount: 6 },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', districtsCount: 4 },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', districtsCount: 8 },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', districtsCount: 4 }
];

export const DISTRICTS = [
  // ঢাকা বিভাগ (13)
  {
    id: 'dhaka-dist',
    divisionId: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    aliases: ['ঢাকা জেলা', 'Dacca'],
    lat: 23.8103,
    lng: 90.4125,
    upazilas: ['সাভার', 'ধামরাই', 'কেরানীগঞ্জ', 'নবাবগঞ্জ', 'দোহার', 'মিরপুর', 'ধানমন্ডি', 'গুলশান', 'উত্তরা', 'মতিঝিল', 'মোহাম্মদপুর']
  },
  {
    id: 'gazipur',
    divisionId: 'dhaka',
    nameBn: 'গাজীপুর',
    nameEn: 'Gazipur',
    aliases: ['Gazipur District'],
    lat: 24.0023,
    lng: 90.4264,
    upazilas: ['গাজীপুর সদর', 'শ্রীপুর', 'কালিয়াকৈর', 'কাপাসিয়া', 'কালীগঞ্জ', 'টঙ্গী']
  },
  {
    id: 'narayanganj',
    divisionId: 'dhaka',
    nameBn: 'নারায়ণগঞ্জ',
    nameEn: 'Narayanganj',
    aliases: ['Narayanganj'],
    lat: 23.6238,
    lng: 90.5000,
    upazilas: ['নারায়ণগঞ্জ সদর', 'সোনারগাঁও', 'রূপগঞ্জ', 'বন্দর', 'আড়াইহাজার']
  },
  {
    id: 'tangail',
    divisionId: 'dhaka',
    nameBn: 'টাঙ্গাইল',
    nameEn: 'Tangail',
    aliases: ['Tangail'],
    lat: 24.2513,
    lng: 89.9167,
    upazilas: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'ঘাটাইল', 'মধুপুর', 'সখিপুর', 'কালিহাতী', 'গোপালপুর']
  },
  {
    id: 'faridpur',
    divisionId: 'dhaka',
    nameBn: 'ফরিদপুর',
    nameEn: 'Faridpur',
    aliases: ['Faridpur'],
    lat: 23.6071,
    lng: 89.8429,
    upazilas: ['ফরিদপুর সদর', 'ভাঙ্গা', 'বোয়ালমারী', 'মধুখালী', 'নগরকান্দা', 'সদরপুর']
  },
  {
    id: 'manikganj',
    divisionId: 'dhaka',
    nameBn: 'মানিকগঞ্জ',
    nameEn: 'Manikganj',
    aliases: ['Manikganj'],
    lat: 23.8617,
    lng: 90.0003,
    upazilas: ['মানিকগঞ্জ সদর', 'সিংগাইর', 'শিবালয়', 'ঘিওর', 'দৌলতপুর', 'সাটুরিয়া']
  },
  {
    id: 'munshiganj',
    divisionId: 'dhaka',
    nameBn: 'মুন্সীগঞ্জ',
    nameEn: 'Munshiganj',
    aliases: ['Bikrampur', 'Munshigonj'],
    lat: 23.5422,
    lng: 90.5305,
    upazilas: ['মুন্সীগঞ্জ সদর', 'শ্রীনগর', 'সিরাজদিখান', 'লৌহজং', 'টঙ্গীবাড়ি', 'গজারিয়া']
  },
  {
    id: 'narsingdi',
    divisionId: 'dhaka',
    nameBn: 'নরসিংদী',
    nameEn: 'Narsingdi',
    aliases: ['Narsingdi'],
    lat: 23.9322,
    lng: 90.7154,
    upazilas: ['নরসিংদী সদর', 'পলাশ', 'রায়পুরা', 'শিবপুর', 'বেলাবো', 'মনোহরদী']
  },
  {
    id: 'kishoreganj',
    divisionId: 'dhaka',
    nameBn: 'কিশোরগঞ্জ',
    nameEn: 'Kishoreganj',
    aliases: ['Kishoregonj'],
    lat: 24.4449,
    lng: 90.7766,
    upazilas: ['কিশোরগঞ্জ সদর', 'নিকলী', 'ভৈরব', 'বাজিতপুর', 'করিমগঞ্জ', 'অষ্টগ্রাম', 'তাড়াইল']
  },
  {
    id: 'gopalganj',
    divisionId: 'dhaka',
    nameBn: 'গোপালগঞ্জ',
    nameEn: 'Gopalganj',
    aliases: ['Gopalgonj'],
    lat: 23.0051,
    lng: 89.8266,
    upazilas: ['গোপালগঞ্জ সদর', 'টুঙ্গিপাড়া', 'কোটালীপাড়া', 'কাশিয়ানী', 'মুকসুদপুর']
  },
  {
    id: 'madaripur',
    divisionId: 'dhaka',
    nameBn: 'মাদারীপুর',
    nameEn: 'Madaripur',
    aliases: ['Madaripur'],
    lat: 23.1641,
    lng: 90.1897,
    upazilas: ['মাদারীপুর সদর', 'শিবচর', 'কালকিনি', 'রাজৈর']
  },
  {
    id: 'rajbari',
    divisionId: 'dhaka',
    nameBn: 'রাজবাড়ী',
    nameEn: 'Rajbari',
    aliases: ['Rajbari'],
    lat: 23.7574,
    lng: 89.6445,
    upazilas: ['রাজবাড়ী সদর', 'পাংশা', 'বালিয়াকান্দি', 'গোয়ালন্দ', 'কালুখালী']
  },
  {
    id: 'shariatpur',
    divisionId: 'dhaka',
    nameBn: 'শরীয়তপুর',
    nameEn: 'Shariatpur',
    aliases: ['Shariatpur'],
    lat: 23.2423,
    lng: 90.4348,
    upazilas: ['শরীয়তপুর সদর', 'নড়িয়া', 'জাজিরা', 'ডামুড্যা', 'ভেদরগঞ্জ', 'গোসাইরহাট']
  },

  // চট্টগ্রাম বিভাগ (11)
  {
    id: 'chattogram-dist',
    divisionId: 'chattogram',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    aliases: ['Chittagong', 'চাটগাঁ'],
    lat: 22.3569,
    lng: 91.7832,
    upazilas: ['পটিয়া', 'মীরসরাই', 'সীতাকুণ্ড', 'হাটহাজারী', 'রাঙ্গুনিয়া', 'সন্দ্বীপ', 'বোয়ালখালী', 'আনোয়ারা', 'ফটিকছড়ি', 'কোতোয়ালী', 'পাঁচলাইশ']
  },
  {
    id: 'coxsbazar',
    divisionId: 'chattogram',
    nameBn: 'কক্সবাজার',
    nameEn: "Cox's Bazar",
    aliases: ['Coxsbazar', 'কক্সবাজার জেলা'],
    lat: 21.4272,
    lng: 92.0058,
    upazilas: ['কক্সবাজার সদর', 'টেকনাফ', 'উখিয়া', 'রামু', 'চকোরিয়া', 'মহেশখালী', 'পেকুয়া', 'কুতুবদিয়া']
  },
  {
    id: 'cumilla',
    divisionId: 'chattogram',
    nameBn: 'কুমিল্লা',
    nameEn: 'Cumilla',
    aliases: ['Comilla', 'কুমিল্লা জেলা'],
    lat: 23.4607,
    lng: 91.1809,
    upazilas: ['আদর্শ সদর', 'লাকসাম', 'দাউদকান্দি', 'চৌদ্দগ্রাম', 'দেবিদ্বার', 'বুড়িচং', 'হোমনা', 'মুরাদনগর', 'বরুড়া']
  },
  {
    id: 'feni',
    divisionId: 'chattogram',
    nameBn: 'ফেনী',
    nameEn: 'Feni',
    aliases: ['Feni'],
    lat: 23.0159,
    lng: 91.3976,
    upazilas: ['ফেনী সদর', 'দাগনভূঞা', 'সোনাগাজী', 'ছাগলনাইয়া', 'পরশুরাম', 'ফুলগাজী']
  },
  {
    id: 'brahmanbaria',
    divisionId: 'chattogram',
    nameBn: 'ব্রাহ্মণবাড়িয়া',
    nameEn: 'Brahmanbaria',
    aliases: ['B-Baria', 'Brahmanbaria'],
    lat: 23.9571,
    lng: 91.1119,
    upazilas: ['ব্রাহ্মণবাড়িয়া সদর', 'আশুগঞ্জ', 'কসবা', 'নবীনগর', 'সরাইল', 'নাসিরনগর', 'বাঞ্ছারামপুর']
  },
  {
    id: 'noakhali',
    divisionId: 'chattogram',
    nameBn: 'নোয়াখালী',
    nameEn: 'Noakhali',
    aliases: ['Noakhali'],
    lat: 22.8696,
    lng: 91.0994,
    upazilas: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'কোম্পানীগঞ্জ', 'হাতিয়া', 'সেনবাগ', 'সুবর্ণচর']
  },
  {
    id: 'chandpur',
    divisionId: 'chattogram',
    nameBn: 'চাঁদপুর',
    nameEn: 'Chandpur',
    aliases: ['Chandpur'],
    lat: 23.2333,
    lng: 90.6667,
    upazilas: ['চাঁদপুর সদর', 'হাজীগঞ্জ', 'মতলব উত্তর', 'মতলব দক্ষিণ', 'ফরিদগঞ্জ', 'শাহরাস্তি']
  },
  {
    id: 'lakshmipur',
    divisionId: 'chattogram',
    nameBn: 'লক্ষ্মীপুর',
    nameEn: 'Lakshmipur',
    aliases: ['Laxmipur'],
    lat: 22.9425,
    lng: 90.8412,
    upazilas: ['লক্ষ্মীপুর সদর', 'রামগঞ্জ', 'রায়পুর', 'রামগতি', 'কমলনগর']
  },
  {
    id: 'rangamati',
    divisionId: 'chattogram',
    nameBn: 'রাঙ্গামাটি',
    nameEn: 'Rangamati',
    aliases: ['Rangamati Hill'],
    lat: 22.6533,
    lng: 92.1753,
    upazilas: ['রাঙ্গামাটি সদর', 'কাপ্তাই', 'বাঘাইছড়ি', 'নানিয়ারচর', 'লংগদু', 'বরকল']
  },
  {
    id: 'khagrachhari',
    divisionId: 'chattogram',
    nameBn: 'খাগড়াছড়ি',
    nameEn: 'Khagrachhari',
    aliases: ['Khagrachari'],
    lat: 23.1193,
    lng: 91.9847,
    upazilas: ['খাগড়াছড়ি সদর', 'দীঘিনালা', 'পানছড়ি', 'মহালছড়ি', 'মাটিরাঙ্গা', 'রামগড়']
  },
  {
    id: 'bandarban',
    divisionId: 'chattogram',
    nameBn: 'বান্দরবান',
    nameEn: 'Bandarban',
    aliases: ['Bandarban Hill'],
    lat: 22.1953,
    lng: 92.2184,
    upazilas: ['বান্দরবান সদর', 'রুমা', 'থানচি', 'রোয়াংছড়ি', 'লামা', 'আলীকদম', 'নাইক্ষ্যংছড়ি']
  },

  // রাজশাহী বিভাগ (8)
  {
    id: 'rajshahi-dist',
    divisionId: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    aliases: ['Rajshahi District'],
    lat: 24.3636,
    lng: 88.6241,
    upazilas: ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'বাঘা', 'চারঘাট', 'পুঠিয়া', 'গোদাগাড়ী', 'তানোর', 'বাগমারা', 'দুর্গাপুর']
  },
  {
    id: 'bogura',
    divisionId: 'rajshahi',
    nameBn: 'বগুড়া',
    nameEn: 'Bogura',
    aliases: ['Bogra', 'বগুড়া'],
    lat: 24.8465,
    lng: 89.3777,
    upazilas: ['বগুড়া সদর', 'শিবগঞ্জ', 'শেরপুর', 'গাবতলী', 'শাজাহানপুর', 'ধুনট', 'সারিয়াকান্দি', 'দুপচাঁচিয়া']
  },
  {
    id: 'pabna',
    divisionId: 'rajshahi',
    nameBn: 'পাবনা',
    nameEn: 'Pabna',
    aliases: ['Pabna'],
    lat: 24.0064,
    lng: 89.2372,
    upazilas: ['পাবনা সদর', 'ঈশ্বরদী', 'সাঁথিয়া', 'সুজানগর', 'চাটমোহর', 'ফরিদপুর', 'বেড়া']
  },
  {
    id: 'sirajganj',
    divisionId: 'rajshahi',
    nameBn: 'সিরাজগঞ্জ',
    nameEn: 'Sirajganj',
    aliases: ['Sirajgonj'],
    lat: 24.4534,
    lng: 89.7008,
    upazilas: ['সিরাজগঞ্জ সদর', 'শাহজাদপুর', 'উল্লাপাড়া', 'বেলকুচি', 'রায়গঞ্জ', 'তাড়াশ', 'কাজীপুর']
  },
  {
    id: 'naogaon',
    divisionId: 'rajshahi',
    nameBn: 'নওগাঁ',
    nameEn: 'Naogaon',
    aliases: ['Naogaon'],
    lat: 24.7936,
    lng: 88.9318,
    upazilas: ['নওগাঁ সদর', 'মহাদেবপুর', 'বদলগাছী', 'পত্নীতলা', 'সাপাহার', 'পোরশা', 'মান্দা']
  },
  {
    id: 'natore',
    divisionId: 'rajshahi',
    nameBn: 'নাটোর',
    nameEn: 'Natore',
    aliases: ['Natore'],
    lat: 24.4206,
    lng: 88.9324,
    upazilas: ['নাটোর সদর', 'সিংড়া', 'বড়াইগ্রাম', 'গুরুদাসপুর', 'লালপুর', 'বাগাতিপাড়া']
  },
  {
    id: 'chapai-nawabganj',
    divisionId: 'rajshahi',
    nameBn: 'চাঁপাইনবাবগঞ্জ',
    nameEn: 'Chapai Nawabganj',
    aliases: ['Nawabganj'],
    lat: 24.5965,
    lng: 88.2776,
    upazilas: ['চাঁপাইনবাবগঞ্জ সদর', 'শিবগঞ্জ', 'গোমস্তাপুর', 'নাচোল', 'ভোলাহাট']
  },
  {
    id: 'joypurhat',
    divisionId: 'rajshahi',
    nameBn: 'জয়পুরহাট',
    nameEn: 'Joypurhat',
    aliases: ['Jaipurhat'],
    lat: 25.1015,
    lng: 89.0277,
    upazilas: ['জয়পুরহাট সদর', 'পাঁচবিবি', 'কালাই', 'ক্ষেতলাল', 'আক্কেলপুর']
  },

  // খুলনা বিভাগ (10)
  {
    id: 'khulna-dist',
    divisionId: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    aliases: ['Khulna District'],
    lat: 22.8456,
    lng: 89.5403,
    upazilas: ['খুলনা সদর', 'রূপসা', 'ডুমুরিয়া', 'বটিয়াঘাটা', 'পাইকগাছা', 'কয়রা', 'দাকোপ', 'ফুলতলা', 'দিঘলিয়া']
  },
  {
    id: 'jashore',
    divisionId: 'khulna',
    nameBn: 'যশোর',
    nameEn: 'Jashore',
    aliases: ['Jessore', 'যশোর জেলা'],
    lat: 23.1664,
    lng: 89.2081,
    upazilas: ['যশোর সদর', 'ঝিকরগাছা', 'শার্শা', 'মণিরামপুর', 'কেশবপুর', 'বাঘারপাড়া', 'অভয়নগর', 'চৌগাছা']
  },
  {
    id: 'kushtia',
    divisionId: 'khulna',
    nameBn: 'কুষ্টিয়া',
    nameEn: 'Kushtia',
    aliases: ['Kushtia'],
    lat: 23.9013,
    lng: 89.1205,
    upazilas: ['কুষ্টিয়া সদর', 'কুমারখালী', 'ভেড়ামারা', 'মিরপুর', 'দৌলতপুর', 'খোকসা']
  },
  {
    id: 'satkhira',
    divisionId: 'khulna',
    nameBn: 'সাতক্ষীরা',
    nameEn: 'Satkhira',
    aliases: ['Satkhira'],
    lat: 22.7185,
    lng: 89.0705,
    upazilas: ['সাতক্ষীরা সদর', 'শ্যামনগর', 'কালীগঞ্জ', 'আশাশুনি', 'কলারোয়া', 'তালা', 'দেবহাটা']
  },
  {
    id: 'bagerhat',
    divisionId: 'khulna',
    nameBn: 'বাগেরহাট',
    nameEn: 'Bagerhat',
    aliases: ['Bagerhat'],
    lat: 22.6516,
    lng: 89.7859,
    upazilas: ['বাগেরহাট সদর', 'মোংলা', 'মোরেলগঞ্জ', 'শরণখোলা', 'রামপাল', 'ফকিরহাট', 'কচুয়া']
  },
  {
    id: 'jhenaidah',
    divisionId: 'khulna',
    nameBn: 'ঝিনাইদহ',
    nameEn: 'Jhenaidah',
    aliases: ['Jhenaidah'],
    lat: 23.5448,
    lng: 89.1539,
    upazilas: ['ঝিনাইদহ সদর', 'শৈলকুপা', 'কালীগঞ্জ', 'হরিনাকুণ্ডু', 'কোটচাঁদপুর', 'মহেশপুর']
  },
  {
    id: 'chuadanga',
    divisionId: 'khulna',
    nameBn: 'চুয়াডাঙ্গা',
    nameEn: 'Chuadanga',
    aliases: ['Chuadanga'],
    lat: 23.6402,
    lng: 88.8418,
    upazilas: ['চুয়াডাঙ্গা সদর', 'আলমডাঙ্গা', 'দামুড়হুদা', 'জীবননগর']
  },
  {
    id: 'magura',
    divisionId: 'khulna',
    nameBn: 'মাগুরা',
    nameEn: 'Magura',
    aliases: ['Magura'],
    lat: 23.4873,
    lng: 89.4199,
    upazilas: ['মাগুরা সদর', 'শ্রীপুর', 'শালিখা', 'মহম্মদপুর']
  },
  {
    id: 'meherpur',
    divisionId: 'khulna',
    nameBn: 'মেহেরপুর',
    nameEn: 'Meherpur',
    aliases: ['Meherpur'],
    lat: 23.7622,
    lng: 88.6318,
    upazilas: ['মেহেরপুর সদর', 'গাংনী', 'মুজিবনগর']
  },
  {
    id: 'narail',
    divisionId: 'khulna',
    nameBn: 'নড়াইল',
    nameEn: 'Narail',
    aliases: ['Narail'],
    lat: 23.1725,
    lng: 89.5127,
    upazilas: ['নড়াইল সদর', 'লোহাগড়া', 'কালিয়া']
  },

  // বরিশাল বিভাগ (6)
  {
    id: 'barishal-dist',
    divisionId: 'barishal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    aliases: ['Barisal'],
    lat: 22.7010,
    lng: 90.3535,
    upazilas: ['বরিশাল সদর', 'বাবুগঞ্জ', 'বাকেরগঞ্জ', 'গৌরনদী', 'মেহেন্দিগঞ্জ', 'হিজলা', 'বানারীপাড়া', 'মুলাদী']
  },
  {
    id: 'patuakhali',
    divisionId: 'barishal',
    nameBn: 'পটুয়াখালী',
    nameEn: 'Patuakhali',
    aliases: ['Patuakhali'],
    lat: 22.3596,
    lng: 90.3299,
    upazilas: ['পটুয়াখালী সদর', 'কলাপাড়া', 'কুয়াকাটা', 'বাউফল', 'গলাচিপা', 'দশমিনা', 'মির্জাগঞ্জ']
  },
  {
    id: 'bhola',
    divisionId: 'barishal',
    nameBn: 'ভোলা',
    nameEn: 'Bhola',
    aliases: ['Bhola Island'],
    lat: 22.6859,
    lng: 90.6481,
    upazilas: ['ভোলা সদর', 'বোরহানউদ্দিন', 'দৌলতখান', 'চরফ্যাশন', 'লালমোহন', 'তজুমদ্দিন', 'মনপুরা']
  },
  {
    id: 'pirojpur',
    divisionId: 'barishal',
    nameBn: 'পিরোজপুর',
    nameEn: 'Pirojpur',
    aliases: ['Pirojpur'],
    lat: 22.5841,
    lng: 89.9720,
    upazilas: ['পিরোজপুর সদর', 'ভাণ্ডারিয়া', 'মঠবাড়িয়া', 'স্বরূপকাঠি', 'নাজিরপুর', 'কাউখালী', 'ইন্দুরকানী']
  },
  {
    id: 'barguna',
    divisionId: 'barishal',
    nameBn: 'বরগুনা',
    nameEn: 'Barguna',
    aliases: ['Barguna'],
    lat: 22.1500,
    lng: 90.1250,
    upazilas: ['বরগুনা সদর', 'আমতলী', 'পাথরঘাটা', 'তালতলী', 'বামনা', 'বেতাগী']
  },
  {
    id: 'jhalokathi',
    divisionId: 'barishal',
    nameBn: 'ঝালকাঠি',
    nameEn: 'Jhalokathi',
    aliases: ['Jhalakati'],
    lat: 22.6423,
    lng: 90.1987,
    upazilas: ['ঝালকাঠি সদর', 'নলছিটি', 'রাজাপুর', 'কাঁঠালিয়া']
  },

  // সিলেট বিভাগ (4)
  {
    id: 'sylhet-dist',
    divisionId: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    aliases: ['Sylhet District', 'শ্রীহট্ট'],
    lat: 24.8949,
    lng: 91.8687,
    upazilas: ['সিলেট সদর', 'বিয়ানীবাজার', 'গোলাপগঞ্জ', 'জৈন্তাপুর', 'কোম্পানীগঞ্জ', 'গোয়াইনঘাট', 'কানাইঘাট', 'জকিগঞ্জ', 'ফেঞ্চুগঞ্জ']
  },
  {
    id: 'moulvibazar',
    divisionId: 'sylhet',
    nameBn: 'মৌলভীবাজার',
    nameEn: 'Moulvibazar',
    aliases: ['Maulvibazar'],
    lat: 24.4829,
    lng: 91.7774,
    upazilas: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'কমলগঞ্জ', 'কুলাউড়া', 'বড়লেখা', 'রাজনগর', 'জুড়ী']
  },
  {
    id: 'habiganj',
    divisionId: 'sylhet',
    nameBn: 'হবিগঞ্জ',
    nameEn: 'Habiganj',
    aliases: ['Habigonj'],
    lat: 24.3749,
    lng: 91.4155,
    upazilas: ['হবিগঞ্জ সদর', 'মাধবপুর', 'চুনারুঘাট', 'নবীগঞ্জ', 'বাহুবল', 'বানিয়াচং', 'আজমিরীগঞ্জ', 'লাখাই']
  },
  {
    id: 'sunamganj',
    divisionId: 'sylhet',
    nameBn: 'সুনামগঞ্জ',
    nameEn: 'Sunamganj',
    aliases: ['Sunamgonj'],
    lat: 25.0658,
    lng: 91.3950,
    upazilas: ['সুনামগঞ্জ সদর', 'তাহিরপুর', 'ছাতক', 'দিরাই', 'দোয়ারাবাজার', 'জগন্নাথপুর', 'ধর্মপাশা', 'শাল্লা']
  },

  // রংপুর বিভাগ (8)
  {
    id: 'rangpur-dist',
    divisionId: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    aliases: ['Rangpur District'],
    lat: 25.7439,
    lng: 89.2752,
    upazilas: ['রংপুর সদর', 'গঙ্গাচড়া', 'তারাগঞ্জ', 'বদরগঞ্জ', 'পীরগাছা', 'পীরগঞ্জ', 'মিঠাপুকুর', 'কাউনিয়া']
  },
  {
    id: 'dinajpur',
    divisionId: 'rangpur',
    nameBn: 'দিনাজপুর',
    nameEn: 'Dinajpur',
    aliases: ['Dinajpur'],
    lat: 25.6217,
    lng: 88.6355,
    upazilas: ['দিনাজপুর সদর', 'বিরামপুর', 'বীরগঞ্জ', 'বোচাগঞ্জ', 'ফুলবাড়ী', 'পার্বতীপুর', 'কাহারোল', 'হাকিমপুর']
  },
  {
    id: 'kurigram',
    divisionId: 'rangpur',
    nameBn: 'কুড়িগ্রাম',
    nameEn: 'Kurigram',
    aliases: ['Kurigram'],
    lat: 25.8072,
    lng: 89.6295,
    upazilas: ['কুড়িগ্রাম সদর', 'চিলমারী', 'উলিপুর', 'নাগেশ্বরী', 'ভূরুঙ্গামারী', 'রৌমারী', 'রাজিবপুর']
  },
  {
    id: 'gaibandha',
    divisionId: 'rangpur',
    nameBn: 'গাইবান্ধা',
    nameEn: 'Gaibandha',
    aliases: ['Gaibandha'],
    lat: 25.3288,
    lng: 89.5404,
    upazilas: ['গাইবান্ধা সদর', 'গোবিন্দগঞ্জ', 'সুন্দরগঞ্জ', 'পলাশবাড়ী', 'সাদুল্লাপুর', 'ফুলছড়ি', 'সাঘাটা']
  },
  {
    id: 'nilphamari',
    divisionId: 'rangpur',
    nameBn: 'নীলফামারী',
    nameEn: 'Nilphamari',
    aliases: ['Nilphamari'],
    lat: 25.9318,
    lng: 88.8560,
    upazilas: ['নীলফামারী সদর', 'সৈয়দপুর', 'ডোমার', 'জলঢাকা', 'কিশোরগঞ্জ', 'ডিমলা']
  },
  {
    id: 'lalmonirhat',
    divisionId: 'rangpur',
    nameBn: 'লালমনিরহাট',
    nameEn: 'Lalmonirhat',
    aliases: ['Lalmonirhat'],
    lat: 25.9923,
    lng: 89.2847,
    upazilas: ['লালমনিরহাট সদর', 'পাটগ্রাম', 'হাতীবান্ধা', 'কালীগঞ্জ', 'আদিতমারী']
  },
  {
    id: 'panchagarh',
    divisionId: 'rangpur',
    nameBn: 'পঞ্চগড়',
    nameEn: 'Panchagarh',
    aliases: ['Panchagarh'],
    lat: 26.3411,
    lng: 88.5542,
    upazilas: ['পঞ্চগড় সদর', 'তেঁতুলিয়া', 'বোদা', 'আটোয়ারী', 'দেবীগঞ্জ']
  },
  {
    id: 'thakurgaon',
    divisionId: 'rangpur',
    nameBn: 'ঠাকুরগাঁও',
    nameEn: 'Thakurgaon',
    aliases: ['Thakurgaon'],
    lat: 26.0337,
    lng: 88.4617,
    upazilas: ['ঠাকুরগাঁও সদর', 'পীরগঞ্জ', 'রাণীশংকৈল', 'বালিয়াডাঙ্গী', 'হরিপুর']
  },

  // ময়মনসিংহ বিভাগ (4)
  {
    id: 'mymensingh-dist',
    divisionId: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    aliases: ['Mymensingh District'],
    lat: 24.7471,
    lng: 90.4203,
    upazilas: ['ময়মনসিংহ সদর', 'মুক্তাগাছা', 'ত্রিশাল', 'ভালুকা', 'গফরগাঁও', 'ঈশ্বরগঞ্জ', 'নান্দাইল', 'ফুলপুর', 'হালুয়াঘাট', 'ধোবাউড়া']
  },
  {
    id: 'jamalpur',
    divisionId: 'mymensingh',
    nameBn: 'জামালপুর',
    nameEn: 'Jamalpur',
    aliases: ['Jamalpur'],
    lat: 24.9375,
    lng: 89.9378,
    upazilas: ['জামালপুর সদর', 'সরিষাবাড়ী', 'মেলান্দহ', 'ইসলামপুর', 'মাদারগঞ্জ', 'দেওয়ানগঞ্জ', 'বকশীগঞ্জ']
  },
  {
    id: 'netrokona',
    divisionId: 'mymensingh',
    nameBn: 'নেত্রকোণা',
    nameEn: 'Netrokona',
    aliases: ['Netrakona'],
    lat: 24.8709,
    lng: 90.7279,
    upazilas: ['নেত্রকোণা সদর', 'দুর্গাপুর', 'কলমাকান্দা', 'কেন্দুয়া', 'বারহাট্টা', 'পূর্বধলা', 'মদন', 'মোহনগঞ্জ']
  },
  {
    id: 'sherpur',
    divisionId: 'mymensingh',
    nameBn: 'শেরপুর',
    nameEn: 'Sherpur',
    aliases: ['Sherpur'],
    lat: 25.0205,
    lng: 90.0153,
    upazilas: ['শেরপুর সদর', 'নকলা', 'নালিতাবাড়ী', 'ঝিনাইগাতী', 'শ্রীবরদী']
  }
];

export const CATEGORIES = [
  { id: 'all', nameBn: 'সকল বিষয়', icon: 'Layers', descBn: 'সারাদেশের সকল ক্যাটাগরির তাজা খবর' },
  { id: 'national_politics', nameBn: 'জাতীয় ও রাজনীতি', icon: 'Landmark', descBn: 'সংসদ, সরকার, রাজনৈতিক দল ও নীতি নির্ধারণ' },
  { id: 'international', nameBn: 'আন্তর্জাতিক ও বিশ্ব', icon: 'Globe', descBn: 'বিশ্ব কূটনীতি, মধ্যপ্রাচ্য ও বৈশ্বিক ঘটনাপ্রবাহ' },
  { id: 'business_economy', nameBn: 'বাণিজ্য ও অর্থনীতি', icon: 'TrendingUp', descBn: 'ব্যাংক, মুদ্রা, কাঁচাবাজার ও শেয়ারবাজার' },
  { id: 'sports', nameBn: 'খেলাধুলা', icon: 'Trophy', descBn: 'ক্রিকেট, ফুটবল, বিশ্বকাপ ও ক্রীড়াঙ্গন' },
  { id: 'entertainment', nameBn: 'বিনোদন ও সংস্কৃতি', icon: 'Film', descBn: 'চলচ্চিত্র, ওটিটি, নাটক, গান ও সংস্কৃতি' },
  { id: 'technology', nameBn: 'বিজ্ঞান ও প্রযুক্তি', icon: 'Laptop', descBn: 'এআই, স্মার্টফোন, গ্যাজেট ও উদ্ভাবন' },
  { id: 'education_jobs', nameBn: 'শিক্ষা ও ক্যারিয়ার', icon: 'GraduationCap', descBn: 'বিশ্ববিদ্যালয়, বিসিএস ও চাকরির খবর' },
  { id: 'law_court', nameBn: 'আইন ও আদালত', icon: 'Scale', descBn: 'সুপ্রিম কোর্ট, রায় ও আইনি তদন্ত' },
  { id: 'agriculture_nature', nameBn: 'কৃষি, প্রকৃতি ও পরিবেশ', icon: 'Leaf', descBn: 'রবিশস্য, নদী রক্ষা ও জলবায়ু' },
  { id: 'health_medicine', nameBn: 'স্বাস্থ্য ও চিকিৎসা', icon: 'HeartPulse', descBn: 'হাসপাতাল, ডেঙ্গু, ঔষধ ও স্বাস্থ্যসেবা' },
  { id: 'transport_traffic', nameBn: 'যোগাযোগ ও পরিবহন', icon: 'Bus', descBn: 'মেট্রোরেল, এক্সপ্রেসওয়ে, ট্রেন ও ট্রাফিক' },
  { id: 'weather_climate', nameBn: 'আবহাওয়া ও দুর্যোগ', icon: 'CloudRain', descBn: 'ঝড়, বন্যা, শৈত্যপ্রবাহ ও পূর্বাভাস' },
  { id: 'diaspora', nameBn: 'প্রবাস ও ডায়াসপোরা', icon: 'Plane', descBn: 'প্রবাসী কল্যাণ, রেমিট্যান্স ও ভিসা' },
  { id: 'lifestyle_religion', nameBn: 'ধর্ম ও জীবনযাপন', icon: 'Sparkles', descBn: 'ইসলামিক চিন্তাধারা, খাদ্যাভ্যাস ও পর্যটন' }
];

export const VERIFICATION_STATUSES = {
  officially_confirmed: {
    labelBn: 'সরকারিভাবে নিশ্চিত',
    shortBn: 'নিশ্চিত',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/20',
    icon: 'ShieldCheck',
    descriptionBn: 'সংশ্লিষ্ট কর্তৃপক্ষ বা অফিসিয়াল গ্যাজেট/বিজ্ঞপ্তি দ্বারা প্রামাণ্যভাবে যাচাইকৃত।'
  },
  multi_source_match: {
    labelBn: 'একাধিক স্বাধীন উৎস মিলেছে',
    shortBn: 'বহু-উৎস মিল',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-300 ring-blue-500/20',
    icon: 'CheckCheck',
    descriptionBn: 'কমপক্ষে দুটি পৃথক স্বাধীন মিডিয়া বা সংবাদদাতার মাঠপর্যায়ের প্রতিবেদনে অভিন্ন তথ্য প্রমাণিত।'
  },
  single_source: {
    labelBn: 'একক উৎস / তথ্য উন্নয়নাধীন',
    shortBn: 'একক উৎস',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-500/20',
    icon: 'Clock',
    descriptionBn: 'মাত্র একটি উৎস সংবাদটি দিয়েছে। অন্য স্বাধীন উৎস থেকে এখনো পূর্ণ মিল পাওয়া যায়নি।'
  },
  conflicting_reports: {
    labelBn: 'পরস্পরবিরোধী সংবাদ / তথ্যের অমিল',
    shortBn: 'পরস্পরবিরোধী',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/20',
    icon: 'AlertOctagon',
    descriptionBn: 'বিভিন্ন সংবাদমাধ্যম বা পক্ষের তথ্যে সংখ্যা, স্থান বা কারণ নিয়ে গুরুতর মতভেদ রয়েছে।'
  },
  unverified: {
    labelBn: 'অযাচিত / প্রাথমিক তথ্য',
    shortBn: 'অযাচিত',
    color: 'slate',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/20',
    icon: 'HelpCircle',
    descriptionBn: 'সোশ্যাল মিডিয়া বা মৌখিক প্রচার; নির্ভরযোগ্য কোনো সাংবাদিক বা সরকারি সূত্র এখনো নিশ্চিত করেনি।'
  }
};
