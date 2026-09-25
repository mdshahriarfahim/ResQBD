/**
 * models/IncidentStatusLog.js
 * ---------------------------
 * একটা incident-এর status বদলানোর প্রতিটা ঘটনার একটা করে row।
 * এটাই citizen-কে দেখানো timeline, আর admin-এর জন্য audit trail।
 */
const mongoose = require('mongoose');
const { INCIDENT_STATUS } = require('../config/constants');

const incidentStatusLogSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    fromStatus: { type: String, enum: [...Object.values(INCIDENT_STATUS), null], default: null },
    toStatus: { type: String, enum: Object.values(INCIDENT_STATUS), required: true },

    // null মানে সিস্টেম নিজে থেকে বদলেছে
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    changedByRole: { type: String, default: 'SYSTEM' },

    note: { type: String, maxlength: 400 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

module.exports = mongoose.model('IncidentStatusLog', incidentStatusLogSchema);