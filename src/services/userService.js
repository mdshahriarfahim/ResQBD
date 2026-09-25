/**
 * services/userService.js
 * -----------------------
 * User management (বেশিরভাগ admin-এর জন্য)।
 *
 * নোট: User.passwordHash স্কিমাতে `select: false` করা আছে। কিছু update
 * operation (যেটা আপডেট হওয়ার পর document ফেরত চায়) এই exclusion আর
 * update-টা একই database command-এ একসাথে করে। সব MongoDB-compatible
 * ডাটাবেজ এটা সাপোর্ট করে না, তাই এখানে সবসময় "আগে update, তারপর নতুন
 * করে পড়া" — এই দুইটা আলাদা সহজ ধাপে করা হয়েছে, এতে সবখানেই কাজ করবে।
 */
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPageInfo } = require('../utils/pagination');
const { escapeRegex } = require('../utils/regex');
const { ROLES } = require('../config/constants');

const list = async ({ role, isActive, search, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = {};

  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: pattern }, { phone: pattern }, { email: pattern }];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    User.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

const getById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User পাওয়া যায়নি');

  const data = { user };
  if (user.role === ROLES.VOLUNTEER) {
    data.volunteerProfile = await VolunteerProfile.findOne({ user: user._id });
  }
  return data;
};

const updateOwnProfile = async (userId, { name, email }) => {
  if (email) {
    const taken = await User.findOne({ email, _id: { $ne: userId } }).lean();
    if (taken) throw ApiError.conflict('এই ইমেইল অন্য একটা account ব্যবহার করছে');
  }

  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;

  const result = await User.updateOne({ _id: userId }, { $set: update }, { runValidators: true });
  if (result.matchedCount === 0) throw ApiError.notFound('User পাওয়া যায়নি');
  return User.findById(userId);
};

const setActive = async (targetId, isActive, admin) => {
  if (String(targetId) === String(admin._id)) {
    throw ApiError.badRequest('নিজের account-এর status নিজে বদলাতে পারবেন না');
  }

  const result = await User.updateOne({ _id: targetId }, { $set: { isActive } });
  if (result.matchedCount === 0) throw ApiError.notFound('User পাওয়া যায়নি');
  const user = await User.findById(targetId);

  // deactivate করা volunteer আর নতুন অফার পাবে না
  if (!isActive && user.role === ROLES.VOLUNTEER) {
    await VolunteerProfile.updateOne({ user: user._id }, { $set: { isAvailable: false } });
  }
  return user;
};

const setRole = async (targetId, role, admin) => {
  if (String(targetId) === String(admin._id)) {
    throw ApiError.badRequest('নিজের role নিজে বদলাতে পারবেন না');
  }

  const result = await User.updateOne({ _id: targetId }, { $set: { role } });
  if (result.matchedCount === 0) throw ApiError.notFound('User পাওয়া যায়নি');
  const user = await User.findById(targetId);

  if (role === ROLES.VOLUNTEER) {
    const exists = await VolunteerProfile.findOne({ user: user._id }).lean();
    if (!exists) await VolunteerProfile.create({ user: user._id });
  } else {
    await VolunteerProfile.updateOne({ user: user._id }, { $set: { isAvailable: false } });
  }
  return user;
};

module.exports = { list, getById, updateOwnProfile, setActive, setRole };