const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res) => {
  const { user, token } = await authService.register(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Registration সফল হয়েছে', data: { user, token } });
};

const login = async (req, res) => {
  const { user, token } = await authService.login(req.body);
  return sendSuccess(res, { message: 'Login সফল হয়েছে', data: { user, token } });
};

const me = async (req, res) => {
  const data = await authService.getProfile(req.user);
  return sendSuccess(res, { message: 'Profile লোড হয়েছে', data });
};

const changePassword = async (req, res) => {
  const { user, token } = await authService.changePassword(req.user._id, req.body);
  return sendSuccess(res, { message: 'পাসওয়ার্ড বদলানো হয়েছে। এখন থেকে নতুন token ব্যবহার করুন', data: { user, token } });
};

module.exports = { register, login, me, changePassword };