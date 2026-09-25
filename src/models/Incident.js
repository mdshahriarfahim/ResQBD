/**
 * models/Incident.js
 * ------------------
 * একটা রিপোর্ট করা emergency, রিপোর্ট হওয়া থেকে close হওয়া পর্যন্ত।
 * `priority` অংশে score এবং পুরো breakdown সেভ থাকে যেটা ব্যাখ্যা করে কেন।
 */
const mongoose = require('mongoose');
const {
  INCIDENT_TYPES,
  SEVERITIES,
  PRIORITY_LEVELS,
  INCIDENT_STATUS,
} = require('../config/constants');

const incidentSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true },

    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    type: { type: String, enum: INCIDENT_TYPES, required: true },
    severity: { type: String, enum: SEVERITIES, required: true },
    description: { type: String, required: true, trim: true, maxlength: 1000 },

    location: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lng: { type: Number, required: true, min: -180, max: 180 },
      address: { type: String, trim: true, maxlength: 200 },
      district: { type: String, trim: true, maxlength: 60 },
      upazila: { type: String, trim: true, maxlength: 60 },
    },

    image: {
      url: { type: String },
      filename: { type: String },
    },

    status: {
      type: String,
      enum: Object.values(INCIDENT_STATUS),
      default: INCIDENT_STATUS.REPORTED,
    },

    // Explainable priority
    priority: {
      score: { type: Number },
      level: { type: String, enum: PRIORITY_LEVELS },
      breakdown: { type: mongoose.Schema.Types.Mixed },
      explanation: { type: String },
      formulaVersion: { type: String },
      calculatedAt: { type: Date },
    },

    // এখন কোন assignment এই incident সামলাচ্ছে (কেউ না থাকলে null)
    activeAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', default: null },

    // এখন পর্যন্ত কতবার matching round চলেছে
    matchAttempts: { type: Number, default: 0 },

    escalationReason: { type: String },

    acceptedAt: { type: Date },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, maxlength: 300 },
  },
  { timestamps: true, versionKey: false }
);

incidentSchema.index({ status: 1, 'priority.score': -1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ type: 1 });

module.exports = mongoose.model('Incident', incidentSchema);