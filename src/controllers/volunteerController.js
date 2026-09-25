const volunteerService = require('../services/volunteerService');
const { sendSuccess } = require('../utils/apiResponse');

const getMe = async (req, res) => {
  const profile = await volunteerService.getOwnProfile(req.user._id);
  return sendSuccess(res, { message: 'Volunteer profile লোড হয়েছে', data: { profile } });
};

const updateMe = async (req, res) => {
  const profile = await volunteerService.updateOwnProfile(req.user._id, req.body);
  return sendSuccess(res, { message: 'Volunteer profile আপডেট হয়েছে', data: { profile } });
};

const setAvailability = async (req, res) => {
  const profile = await volunteerService.setAvailability(req.user._id, req.body.isAvailable);
  return sendSuccess(res, {
    message: profile.isAvailable ? 'আপনি এখন assignment-এর জন্য available' : 'আপনি এখন unavailable',
    data: { profile },
  });
};

const updateLocation = async (req, res) => {
  const profile = await volunteerService.updateLocation(req.user._id, req.body);
  return sendSuccess(res, { message: 'Location আপডেট হয়েছে', data: { profile } });
};

const list = async (req, res) => {
  const data = await volunteerService.list(req.validated.query);
  return sendSuccess(res, { message: 'Volunteers লোড হয়েছে', data });
};

const getByUserId = async (req, res) => {
  const profile = await volunteerService.getByUserId(req.params.userId);
  return sendSuccess(res, { message: 'Volunteer লোড হয়েছে', data: { profile } });
};

const adminUpdate = async (req, res) => {
  const profile = await volunteerService.adminUpdate(req.params.userId, req.body);
  return sendSuccess(res, { message: 'Volunteer আপডেট হয়েছে', data: { profile } });
};

module.exports = { getMe, updateMe, setAvailability, updateLocation, list, getByUserId, adminUpdate };