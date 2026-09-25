/**
 * services/notificationService.js
 * -------------------------------
 * Notification-এর পুরো architecture: সিস্টেমের যেকোনো জায়গা থেকে শুধু
 * notify() / notifyAdmins() কল করা হয়, আর কিছু না।
 * notify() দুইটা কাজ করে:
 *   ১. database-এ সেভ করে (in-app list-এর জন্য),
 *   ২. Socket.io দিয়ে সাথে সাথে পাঠিয়ে দেয় (real-time)।
 * পরে চাইলে এখানেই SMS/push notification যোগ করা যাবে, অন্য কোনো
 * ফাইল বদলাতে হবে না।
 *
 * Notification পাঠাতে ব্যর্থ হলে সেটা মূল কাজ (যেমন assignment accept
 * করা) কখনো ভাঙবে না — error শুধু log হবে।
 */
const Notification = require('../models/Notification');
const User = require('../models/User');
const realtime = require('../socket');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/constants');
const { getPagination, buildPageInfo } = require('../utils/pagination');

const notify = async ({ user, type, title, message, incident, assignment }) => {
  try {
    const notification = await Notification.create({ user, type, title, message, incident, assignment });
    realtime.emitToUser(user, 'notification:new', notification.toJSON());
    return notification;
  } catch (err) {
    console.error('Notification failed:', err.message);
    return null;
  }
};

const notifyAdmins = async (payload) => {
  try {
    const admins = await User.find({ role: ROLES.ADMIN, isActive: true }).select('_id').lean();
    return await Promise.all(admins.map((admin) => notify({ ...payload, user: admin._id })));
  } catch (err) {
    console.error('Admin notification failed:', err.message);
    return [];
  }
};

const listForUser = async (userId, { unreadOnly, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = { user: userId };
  if (unreadOnly) filter.isRead = false;

  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Notification.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

const unreadCount = async (userId) => {
  const count = await Notification.countDocuments({ user: userId, isRead: false });
  return { unread: count };
};

const markRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true, readAt: new Date() } },
    { returnDocument: 'after' }
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  return notification;
};

const markAllRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { updated: result.modifiedCount };
};

module.exports = { notify, notifyAdmins, listForUser, unreadCount, markRead, markAllRead };