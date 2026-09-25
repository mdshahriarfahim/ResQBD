/**
 * middleware/auth.js
 * ------------------
 * "protect" চেক করে যে request একজন লগইন করা user-এর কাছ থেকে এসেছে।
 *
 * Frontend token পাঠায় এই header-এ:
 *   Authorization: Bearer <token>
 *
 * সফল হলে লগইন করা user পাওয়া যাবে `req.user` দিয়ে।
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('এই resource ব্যবহার করতে দয়া করে লগইন করুন');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('আপনার session-এর মেয়াদ শেষ। দয়া করে আবার লগইন করুন');
    }
    throw ApiError.unauthorized('Invalid token। দয়া করে আবার লগইন করুন');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized('এই account আর নেই');
  if (!user.isActive) throw ApiError.forbidden('এই account deactivate করা হয়েছে');

  // পাসওয়ার্ড বদলানোর আগে ইস্যু করা token reject করা হয়
  if (user.passwordChangedAt && decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
    throw ApiError.unauthorized('পাসওয়ার্ড বদলানো হয়েছে। দয়া করে আবার লগইন করুন');
  }

  req.user = user;
  return next();
};

module.exports = { protect };