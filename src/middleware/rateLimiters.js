/**
 * middleware/rateLimiters.js
 * --------------------------
 * একজন client কতগুলো request পাঠাতে পারবে সেটা সীমিত করে। এটা পাসওয়ার্ড
 * অনুমান করার speed কমায়, আর কেউ যাতে fake রিপোর্ট দিয়ে সিস্টেম ভরিয়ে
 * না ফেলে সেটা আটকায়।
 */
const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

const createLimiter = ({ windowMinutes, max, message }) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => !config.rateLimitEnabled,
    handler: (req, res, next) => next(new ApiError(429, message)),
  });

// পুরো API: প্রতি ১৫ মিনিটে ৩০০টা request
const apiLimiter = createLimiter({
  windowMinutes: 15,
  max: 300,
  message: 'অনেক বেশি request হয়ে গেছে। কিছুক্ষণ পর আবার চেষ্টা করুন',
});

// Login/register: প্রতি ১৫ মিনিটে মাত্র ২০ বার চেষ্টা
const authLimiter = createLimiter({
  windowMinutes: 15,
  max: 20,
  message: 'অনেকবার লগইন চেষ্টা করা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন',
});

// Emergency রিপোর্ট: প্রতি ঘণ্টায় সর্বোচ্চ ১০টা (spam/fake রিপোর্ট আটকায়)
const incidentLimiter = createLimiter({
  windowMinutes: 60,
  max: 10,
  message: 'এই connection থেকে অনেক বেশি incident রিপোর্ট হয়ে গেছে। কিছুক্ষণ পর আবার চেষ্টা করুন',
});

module.exports = { apiLimiter, authLimiter, incidentLimiter };