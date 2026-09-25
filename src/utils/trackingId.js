/**
 * utils/trackingId.js
 * -------------------
 * citizen-কে দেখানো tracking ID বানায়, যেমন RQ-20260925-K7M2XP
 *   RQ        = ResQBD
 *   20260925  = রিপোর্ট করার তারিখ
 *   K7M2XP    = ৬টা random অক্ষর
 * বিভ্রান্তিকর অক্ষর (0, O, 1, I) বাদ দেওয়া হয়েছে, যাতে জোরে পড়তেও সহজ হয়।
 */
const crypto = require('crypto');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateTrackingId = (date = new Date()) => {
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');

  let randomPart = '';
  for (let i = 0; i < 6; i += 1) {
    randomPart += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }

  return `RQ-${datePart}-${randomPart}`;
};

const TRACKING_ID_REGEX = /^RQ-\d{8}-[A-Z0-9]{6}$/;

module.exports = { generateTrackingId, TRACKING_ID_REGEX };