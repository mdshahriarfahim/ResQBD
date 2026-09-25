/**
 * models/User.js
 * --------------
 * একটা account। role অনুযায়ী ঠিক হয় কে কী করতে পারবে:
 * CITIZEN রিপোর্ট করে, VOLUNTEER সাড়া দেয়, ADMIN সব দেখাশোনা করে।
 */
const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },

    // 01XXXXXXXXX ফরম্যাটে সেভ হবে
    phone: { type: String, required: true, unique: true, trim: true },

    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },

    // select:false মানে normal query তে এই hash কখনো ফেরত আসবে না
    passwordHash: { type: String, required: true, select: false },

    role: { type: String, enum: Object.values(ROLES), default: ROLES.CITIZEN, index: true },

    isActive: { type: Boolean, default: true },

    lastLoginAt: { type: Date },

    // এই সময়ের আগে ইস্যু করা token বাতিল ধরা হবে (দেখো middleware/auth.js)
    passwordChangedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
