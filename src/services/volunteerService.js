/**
 * services/volunteerService.js
 * ----------------------------
 * Volunteer profile, availability এবং location।
 * Matching শুধু সেইসব volunteer-কেই বিবেচনা করে যারা: verified + available
 * + যাদের location সাম্প্রতিক।
 */
const VolunteerProfile = require('../models/VolunteerProfile');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPageInfo } = require('../utils/pagination');

const getOwnProfile = async (userId) => {
  const profile = await VolunteerProfile.findOne({ user: userId }).populate('user', 'name phone email');
  if (!profile) throw ApiError.notFound('Volunteer profile পাওয়া যায়নি');
  return profile;
};

const updateOwnProfile = async (userId, { skills }) => {
  const profile = await VolunteerProfile.findOneAndUpdate(
    { user: userId },
    { $set: { skills } },
    { returnDocument: 'after', runValidators: true }
  );
  if (!profile) throw ApiError.notFound('Volunteer profile পাওয়া যায়নি');
  return profile;
};

const setAvailability = async (userId, isAvailable) => {
  const profile = await VolunteerProfile.findOne({ user: userId });
  if (!profile) throw ApiError.notFound('Volunteer profile পাওয়া যায়নি');

  if (isAvailable) {
    if (!profile.isVerified) {
      throw ApiError.forbidden('আপনার volunteer account এখনো admin ভেরিফাই করেননি');
    }
    if (!profile.currentLocation || profile.currentLocation.lat === undefined) {
      throw ApiError.badRequest('Available হওয়ার আগে দয়া করে আপনার location শেয়ার করুন');
    }
  }

  profile.isAvailable = isAvailable;
  await profile.save();
  return profile;
};

const updateLocation = async (userId, { latitude, longitude }) => {
  const profile = await VolunteerProfile.findOneAndUpdate(
    { user: userId },
    { $set: { currentLocation: { lat: latitude, lng: longitude, updatedAt: new Date() } } },
    { returnDocument: 'after' }
  );
  if (!profile) throw ApiError.notFound('Volunteer profile পাওয়া যায়নি');
  return profile;
};

/* ---------- admin ---------- */

const list = async ({ isAvailable, isVerified, skill, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = {};
  if (isAvailable !== undefined) filter.isAvailable = isAvailable;
  if (isVerified !== undefined) filter.isVerified = isVerified;
  if (skill) filter.skills = skill;

  const [items, total] = await Promise.all([
    VolunteerProfile.find(filter)
      .populate('user', 'name phone email isActive')
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    VolunteerProfile.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

const getByUserId = async (userId) => {
  const profile = await VolunteerProfile.findOne({ user: userId }).populate('user', 'name phone email isActive');
  if (!profile) throw ApiError.notFound('Volunteer পাওয়া যায়নি');
  return profile;
};

const adminUpdate = async (userId, { isVerified, maxActiveAssignments }) => {
  const update = {};
  if (isVerified !== undefined) update.isVerified = isVerified;
  if (maxActiveAssignments !== undefined) update.maxActiveAssignments = maxActiveAssignments;
  // unverified volunteer কখনো available থাকতে পারবে না
  if (isVerified === false) update.isAvailable = false;

  const profile = await VolunteerProfile.findOneAndUpdate(
    { user: userId },
    { $set: update },
    { returnDocument: 'after', runValidators: true }
  );
  if (!profile) throw ApiError.notFound('Volunteer পাওয়া যায়নি');
  return profile;
};

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  setAvailability,
  updateLocation,
  list,
  getByUserId,
  adminUpdate,
};