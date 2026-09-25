const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/apiResponse');

const list = async (req, res) => {
  const data = await notificationService.listForUser(req.user._id, req.validated.query);
  return sendSuccess(res, { message: 'Notifications লোড হয়েছে', data });
};

const unreadCount = async (req, res) => {
  const data = await notificationService.unreadCount(req.user._id);
  return sendSuccess(res, { message: 'Unread count লোড হয়েছে', data });
};

const markRead = async (req, res) => {
  const notification = await notificationService.markRead(req.user._id, req.params.id);
  return sendSuccess(res, { message: 'পড়া হয়েছে হিসেবে চিহ্নিত করা হলো', data: { notification } });
};

const markAllRead = async (req, res) => {
  const data = await notificationService.markAllRead(req.user._id);
  return sendSuccess(res, { message: 'সব notification পড়া হয়েছে হিসেবে চিহ্নিত করা হলো', data });
};

module.exports = { list, unreadCount, markRead, markAllRead };