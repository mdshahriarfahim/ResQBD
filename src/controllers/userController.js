const userService = require('../services/userService');
const { sendSuccess } = require('../utils/apiResponse');

const list = async (req, res) => {
  const data = await userService.list(req.validated.query);
  return sendSuccess(res, { message: 'Users লোড হয়েছে', data });
};

const getById = async (req, res) => {
  const data = await userService.getById(req.params.id);
  return sendSuccess(res, { message: 'User লোড হয়েছে', data });
};

const updateMe = async (req, res) => {
  const user = await userService.updateOwnProfile(req.user._id, req.body);
  return sendSuccess(res, { message: 'Profile আপডেট হয়েছে', data: { user } });
};

const setActive = async (req, res) => {
  const user = await userService.setActive(req.params.id, req.body.isActive, req.user);
  return sendSuccess(res, { message: user.isActive ? 'User activate করা হয়েছে' : 'User deactivate করা হয়েছে', data: { user } });
};

const setRole = async (req, res) => {
  const user = await userService.setRole(req.params.id, req.body.role, req.user);
  return sendSuccess(res, { message: 'Role আপডেট হয়েছে', data: { user } });
};

module.exports = { list, getById, updateMe, setActive, setRole };