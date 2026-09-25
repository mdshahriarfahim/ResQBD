/**
 * models/AreaDensity.js
 * ---------------------
 * একটা district/upazila-র জনঘনত্ব (প্রতি বর্গ কিমিতে কত মানুষ)।
 * priority algorithm এটা "যেখানে available" ব্যবহার করে। কোনো এলাকা এই
 * collection-এ না থাকলে, density অংশে শুধু ০ পয়েন্ট দেওয়া হবে।
 */
const mongoose = require('mongoose');

const areaDensitySchema = new mongoose.Schema(
  {
    district: { type: String, required: true, trim: true, maxlength: 60 },
    upazila: { type: String, trim: true, maxlength: 60 },

    // lowercase lookup key: "dhaka" অথবা "dhaka|savar"
    key: { type: String, required: true, unique: true },

    populationDensity: { type: Number, required: true, min: 0 },
    source: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('AreaDensity', areaDensitySchema);