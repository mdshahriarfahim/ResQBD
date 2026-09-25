/**
 * models/VolunteerProfile.js
 * --------------------------
 * শুধু volunteer-দের বাড়তি তথ্য। এক User (role VOLUNTEER)-এর জন্য
 * ঠিক একটা VolunteerProfile থাকবে।
 */
const mongoose = require('mongoose');
const { VOLUNTEER_SKILLS } = require('../config/constants');

const volunteerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    skills: {
      type: [{ type: String, enum: VOLUNTEER_SKILLS }],
      default: ['GENERAL'],
    },

    // volunteer নিজে অন/অফ করবে ("আমি এখন সাড়া দিতে পারবো")
    isAvailable: { type: Boolean, default: false },

    // admin ভেরিফাই না করা পর্যন্ত assignment পাবে না
    isVerified: { type: Boolean, default: false },

    currentLocation: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
      updatedAt: { type: Date },
    },

    // একসাথে সর্বোচ্চ কতগুলো incident সামলাতে পারবে
    maxActiveAssignments: { type: Number, default: 1, min: 1, max: 5 },

    // এখন কতগুলো সামলাচ্ছে (atomically বদলানো হয়)
    activeAssignmentCount: { type: Number, default: 0, min: 0 },

    totalCompleted: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

// matching-এর bounding-box সার্চের জন্য
volunteerProfileSchema.index({
  isAvailable: 1,
  isVerified: 1,
  'currentLocation.lat': 1,
  'currentLocation.lng': 1,
});

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);