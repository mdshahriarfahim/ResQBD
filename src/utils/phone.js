/**
 * utils/phone.js
 * --------------
 * বাংলাদেশি মোবাইল নাম্বার অনেকভাবে টাইপ করা যায়:
 *   01712345678, +8801712345678, 8801712345678
 * আমরা সবসময় একটা ফরম্যাটে সেভ করি: 01712345678 (১১ সংখ্যা)।
 */
const BD_MOBILE_REGEX = /^(?:\+?88)?(01[3-9]\d{8})$/;

/**
 * @returns {string|null} ঠিক করা নাম্বার, অথবা null যদি এটা বৈধ BD mobile না হয়
 */
const normalizeBdPhone = (input) => {
  if (typeof input !== 'string') return null;
  const cleaned = input.replace(/[\s-]/g, '');
  const match = cleaned.match(BD_MOBILE_REGEX);
  return match ? match[1] : null;
};

module.exports = { normalizeBdPhone };