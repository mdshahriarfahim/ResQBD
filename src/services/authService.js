/**
 * services/authService.js
 * -----------------------
 * Registration, login, password change।
 *
 * সিকিউরিটি নোট:
 *  - পাসওয়ার্ড bcrypt দিয়ে hash করা হয় (কখনো plain text সেভ হয় না),
 *  - যে কেউ CITIZEN বা VOLUNTEER হিসেবে register করতে পারবে, কিন্তু
 *    কখনো ADMIN হিসেবে না,
 *  - নতুন volunteer-কে assignment পাওয়ার আগে admin ভেরিফাই করতে হবে,
 *  - login error সবসময় "Invalid credentials" (phone/email আছে কিনা
 *    সেটা আমরা প্রকাশ করি না)।
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const ApiError = require('../utils/ApiError');
const { normalizeBdPhone } = require('../utils/phone');
const { ROLES } = require('../config/constants');

const signToken = (user) =>
  jwt.sign({ id: String(user._id), role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

// user না থাকলেও ব্যবহার হয়, যাতে login সবসময় একই রকম সময় নেয়
let dummyHash;
const getDummyHash = () => {
  if (!dummyHash) dummyHash = bcrypt.hashSync('not-a-real-password', config.bcryptRounds);
  return dummyHash;
};

const register = async ({ name, phone, email, password, role, skills }) => {
  const orConditions = [{ phone }];
  if (email) orConditions.push({ email });

  const existing = await User.findOne({ $or: orConditions }).lean();
  if (existing) {
    const field = existing.phone === phone ? 'ফোন নাম্বার' : 'ইমেইল';
    throw ApiError.conflict(`এই ${field} দিয়ে ইতিমধ্যে একটা account আছে`);
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const user = await User.create({ name, phone, email, passwordHash, role });

  if (role === ROLES.VOLUNTEER) {
    try {
      await VolunteerProfile.create({ user: user._id, skills: skills && skills.length ? skills : ['GENERAL'] });
    } catch (err) {
      // লোকাল MongoDB-তে transaction নেই, তাই হাতে User-টা মুছে দিচ্ছি
      await User.deleteOne({ _id: user._id });
      throw err;
    }
  }

  return { user, token: signToken(user) };
};

const login = async ({ identifier, password }) => {
  // identifier হয় ফোন নাম্বার, নাহলে ইমেইল
  const phone = normalizeBdPhone(identifier);
  const query = phone ? { phone } : { email: identifier.toLowerCase() };

  const user = await User.findOne(query).select('+passwordHash');
  const passwordOk = await bcrypt.compare(password, user ? user.passwordHash : getDummyHash());

  if (!user || !passwordOk) throw ApiError.unauthorized('Invalid credentials');
  if (!user.isActive) throw ApiError.forbidden('এই account deactivate করা হয়েছে');

  user.lastLoginAt = new Date();
  await user.save();

  return { user, token: signToken(user) };
};

const getProfile = async (user) => {
  const data = { user };
  if (user.role === ROLES.VOLUNTEER) {
    data.volunteerProfile = await VolunteerProfile.findOne({ user: user._id });
  }
  return data;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw ApiError.badRequest('বর্তমান পাসওয়ার্ড ভুল');

  user.passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);
  user.passwordChangedAt = new Date();
  await user.save();

  // পুরোনো token আর কাজ করবে না, তাই নতুন একটা দেওয়া হচ্ছে
  return { user, token: signToken(user) };
};

module.exports = { register, login, getProfile, changePassword, signToken };