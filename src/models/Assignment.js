/**
 * models/Assignment.js
 * --------------------
 * "এই volunteer-কে এই incident-এর জন্য অফার করা হয়েছে / সে সামলাচ্ছে"।
 * একটা incident-এর অনেকগুলো assignment হতে পারে (একাধিক volunteer-কে
 * অফার, বা কেউ decline করলে নতুন volunteer)।
 * matchBreakdown ব্যাখ্যা করে কেন এই volunteer-কে বেছে নেওয়া হয়েছে।
 */
const mongoose = require('mongoose');
const { ASSIGNMENT_STATUS } = require('../config/constants');

const assignmentSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },

    // volunteer-এর USER id
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.OFFERED,
    },

    distanceKm: { type: Number },
    matchScore: { type: Number },
    matchBreakdown: { type: mongoose.Schema.Types.Mixed },

    round: { type: Number, default: 1 },
    offeredBy: { type: String, enum: ['SYSTEM', 'ADMIN'], default: 'SYSTEM' },

    offeredAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    respondedAt: { type: Date },
    acceptedAt: { type: Date },
    enRouteAt: { type: Date },
    onSceneAt: { type: Date },
    completedAt: { type: Date },

    // দুইজন volunteer একসাথে accept করলে, এই ইউনিক ফিল্ডের কারণে
    // ডাটাবেজ নিজেই ঠিক করে দেয় কে জিতলো (details পরে assignmentService.js এ)
    claimKey: { type: String, unique: true, sparse: true },

    declineReason: { type: String, maxlength: 300 },
    note: { type: String, maxlength: 300 },
  },
  { timestamps: true, versionKey: false }
);

assignmentSchema.index({ incident: 1, volunteer: 1 });
assignmentSchema.index({ volunteer: 1, status: 1 });
assignmentSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);