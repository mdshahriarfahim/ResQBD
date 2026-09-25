const { Joi, bdPhone } = require('./common');
const { ROLES, VOLUNTEER_SKILLS } = require('../config/constants');

const passwordRule = Joi.string()
  .min(8)
  .max(72)
  .pattern(/[A-Za-z]/, 'letter')
  .pattern(/\d/, 'number')
  .messages({
    'string.min': 'পাসওয়ার্ড অন্তত ৮ ক্যারেক্টার হতে হবে',
    'string.max': 'পাসওয়ার্ড সর্বোচ্চ ৭২ ক্যারেক্টার হতে পারবে',
    'string.pattern.name': 'পাসওয়ার্ডে অন্তত একটা অক্ষর এবং একটা সংখ্যা থাকতে হবে',
  });

const register = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  phone: bdPhone.required(),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).empty('').optional(),
  password: passwordRule.required(),
  // ADMIN এখানে ইচ্ছাকৃতভাবে অনুমোদিত না
  role: Joi.string()
    .uppercase()
    .valid(ROLES.CITIZEN, ROLES.VOLUNTEER)
    .default(ROLES.CITIZEN),
  skills: Joi.array()
    .items(Joi.string().uppercase().valid(...VOLUNTEER_SKILLS))
    .unique()
    .max(VOLUNTEER_SKILLS.length),
});

const login = Joi.object({
  identifier: Joi.string().trim().max(120).required(),
  password: Joi.string().max(72).required(),
});

const changePassword = Joi.object({
  currentPassword: Joi.string().max(72).required(),
  newPassword: passwordRule.required(),
});

module.exports = { register, login, changePassword };