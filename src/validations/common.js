/**
 * validations/common.js
 * ---------------------
 * সব validation ফাইলের জন্য common building block।
 */
const Joi = require('joi');
const { normalizeBdPhone } = require('../utils/phone');
const { BANGLADESH_BOUNDS } = require('../config/constants');

const objectId = Joi.string().hex().length(24);

const idParam = Joi.object({ id: objectId.required() });

const pagination = {
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
};

// 01712345678, +8801712345678 ... সবই accept করে, আর ফেরত দেয় 01712345678
const bdPhone = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const normalized = normalizeBdPhone(value);
    return normalized || helpers.error('phone.invalid');
  })
  .messages({ 'phone.invalid': 'একটা বৈধ বাংলাদেশি মোবাইল নাম্বার দিন (যেমন 01712345678)' });

const latitude = Joi.number().min(BANGLADESH_BOUNDS.minLat).max(BANGLADESH_BOUNDS.maxLat).messages({
  'number.min': 'Latitude অবশ্যই বাংলাদেশের ভেতরে হতে হবে',
  'number.max': 'Latitude অবশ্যই বাংলাদেশের ভেতরে হতে হবে',
});

const longitude = Joi.number().min(BANGLADESH_BOUNDS.minLng).max(BANGLADESH_BOUNDS.maxLng).messages({
  'number.min': 'Longitude অবশ্যই বাংলাদেশের ভেতরে হতে হবে',
  'number.max': 'Longitude অবশ্যই বাংলাদেশের ভেতরে হতে হবে',
});

module.exports = { Joi, objectId, idParam, pagination, bdPhone, latitude, longitude };