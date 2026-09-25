/**
 * middleware/notFound.js
 * -----------------------
 * কোনো route-এর সাথে না মিললে এটা চলে (404)। errorHandler-এর কাছে
 * পাঠিয়ে দেয়, যাতে response-এর ফরম্যাট সবজায়গায় একরকম থাকে।
 */
const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route পাওয়া যায়নি: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;