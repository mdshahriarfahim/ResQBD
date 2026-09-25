const { Joi, pagination, latitude, longitude } = require('./common');
const { INCIDENT_TYPES, SEVERITIES, PRIORITY_LEVELS, INCIDENT_STATUS } = require('../config/constants');

// :id হতে পারে database id, অথবা tracking ID যেমন RQ-20260925-K7M2XP
const idOrTrackingParam = Joi.object({
  id: Joi.string().trim().pattern(/^([0-9a-fA-F]{24}|RQ-\d{8}-[A-Za-z0-9]{6})$/).required().messages({
    'string.pattern.base': 'Invalid incident id বা tracking id',
  }),
});

// ফিল্ডগুলো flat রাখা হয়েছে (nested না), যাতে multipart/form-data (ছবি
// আপলোড)-এর সাথেও কাজ করে
const create = Joi.object({
  type: Joi.string().uppercase().valid(...INCIDENT_TYPES).required(),
  severity: Joi.string().uppercase().valid(...SEVERITIES).required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  latitude: latitude.required(),
  longitude: longitude.required(),
  address: Joi.string().trim().max(200).empty(''),
  district: Joi.string().trim().max(60).empty(''),
  upazila: Joi.string().trim().max(60).empty(''),
});

const listMine = Joi.object({
  status: Joi.string().uppercase().valid(...Object.values(INCIDENT_STATUS)),
  ...pagination,
});

const listAll = Joi.object({
  status: Joi.string().uppercase().valid(...Object.values(INCIDENT_STATUS)),
  type: Joi.string().uppercase().valid(...INCIDENT_TYPES),
  severity: Joi.string().uppercase().valid(...SEVERITIES),
  priorityLevel: Joi.string().uppercase().valid(...PRIORITY_LEVELS),
  district: Joi.string().trim().max(60),
  search: Joi.string().trim().max(30),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
  sort: Joi.string().valid('priority', 'newest', 'oldest').default('priority'),
  ...pagination,
});

const cancel = Joi.object({ reason: Joi.string().trim().max(300).empty('') });
const close = Joi.object({ note: Joi.string().trim().max(300).empty('') });

module.exports = { idOrTrackingParam, create, listMine, listAll, cancel, close };