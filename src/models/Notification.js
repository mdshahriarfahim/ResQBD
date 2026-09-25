/**
 * models/Notification.js
 * ----------------------
 * একজন ইউজারের জন্য একটা in-app notification।
 * (পরে চাইলে Push/SMS যোগ করা যাবে notificationService.js বদলেই, বাকি
 * কিছু বদলাতে হবে না।)
 */
const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 400 },

    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);