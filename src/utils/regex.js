/**
 * utils/regex.js
 * --------------
 * ইউজারের সার্চ টেক্সট যখন regular expression-এর ভেতর ব্যবহার হয়,
 * তখন বিশেষ ক্যারেক্টার ( ) * + ইত্যাদি escape করতে হয়। নাহলে কেউ এমন
 * একটা pattern পাঠাতে পারে যেটা search ভেঙে দেয় বা স্লো করে দেয়।
 */
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { escapeRegex };