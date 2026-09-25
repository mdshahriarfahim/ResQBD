/**
 * config/priority.config.js
 * -------------------------
 * Priority algorithm এর সব নাম্বার এখানে। কোথাও কোড এর ভেতর হাতে লেখা নেই।
 * এখানে কোনো একটা নাম্বার বদলালেই পুরো সিস্টেম বদলে যাবে, আর score-এর
 * breakdown সেটা নিজে থেকেই ব্যাখ্যা করে দেবে।
 *
 * Priority score (0 - 100) =
 *     incident type পয়েন্ট       (max 30)
 *   + severity পয়েন্ট             (max 40)
 *   + অপেক্ষার সময়ের পয়েন্ট       (max 20)
 *   + জনঘনত্বের পয়েন্ট            (max 10)
 */
module.exports = {
  version: '1.0',

  // অংশ ১: এই ধরনের incident কতটা বিপজ্জনক? (max 30)
  incidentType: {
    max: 30,
    points: {
      BUILDING_COLLAPSE: 30,
      FIRE: 28,
      MEDICAL: 26,
      CYCLONE: 26,
      ROAD_ACCIDENT: 24,
      FLOOD: 22,
      OTHER: 12,
    },
  },

  // অংশ ২: citizen নিজে কতটা severe বলেছে? (max 40)
  severity: {
    max: 40,
    points: {
      LOW: 10,
      MEDIUM: 20,
      HIGH: 32,
      CRITICAL: 40,
    },
  },

  // অংশ ৩: যত বেশি সময় অপেক্ষা করছে, তত জরুরি হয়ে যাচ্ছে (max 20)
  // points = কত মিনিট অপেক্ষা x pointsPerMinute, কিন্তু max এর বেশি না।
  elapsedTime: {
    max: 20,
    pointsPerMinute: 0.5, // ৪০ মিনিট পর maximum-এ পৌঁছাবে
  },

  // অংশ ৪: চারপাশে বেশি মানুষ থাকা মানে বেশি মানুষ ঝুঁকিতে (max 10)
  // Density = প্রতি বর্গ কিলোমিটারে কত মানুষ। উপর থেকে নিচে চেক করা হয়।
  populationDensity: {
    max: 10,
    bands: [
      { minDensity: 15000, points: 10 },
      { minDensity: 8000, points: 8 },
      { minDensity: 4000, points: 6 },
      { minDensity: 2000, points: 4 },
      { minDensity: 1000, points: 2 },
      { minDensity: 1, points: 1 },
    ],
    // ওই এলাকার জনঘনত্বের ডেটা না থাকলে এই পয়েন্ট দেওয়া হবে
    unknownPoints: 0,
  },

  // চূড়ান্ত score -> level। উপর থেকে নিচে চেক করা হয়।
  levels: [
    { level: 'CRITICAL', minScore: 75 },
    { level: 'HIGH', minScore: 50 },
    { level: 'MEDIUM', minScore: 25 },
    { level: 'LOW', minScore: 0 },
  ],
};