/**
 * middleware/sanitize.js
 * ----------------------
 * NoSQL injection থেকে সুরক্ষা।
 * একজন attacker এমন কিছু পাঠাতে পারে: { "email": { "$gt": "" } },
 * আশা করে যে ডাটাবেজ এটাকে query operator হিসেবে ধরবে। আমরা যেকোনো
 * key যেটা "$" দিয়ে শুরু হয় বা "." থাকে, সেটা reject করি।
 * (Joi validation একটা দ্বিতীয় স্তরের সুরক্ষা দেয়, কারণ এটা শুধু
 * নির্দিষ্ট টাইপ accept করে।)
 */
const ApiError = require('../utils/ApiError');

const hasDangerousKeys = (value, depth = 0) => {
  if (depth > 6 || value === null || typeof value !== 'object') return false;

  return Object.keys(value).some((key) => {
    if (key.startsWith('$') || key.includes('.')) return true;
    return hasDangerousKeys(value[key], depth + 1);
  });
};

const sanitizeInput = (req, res, next) => {
  if (hasDangerousKeys(req.body) || hasDangerousKeys(req.query) || hasDangerousKeys(req.params)) {
    return next(ApiError.badRequest('Request-এ ফিল্ডের নামে অবৈধ ক্যারেক্টার আছে'));
  }
  return next();
};

module.exports = sanitizeInput;