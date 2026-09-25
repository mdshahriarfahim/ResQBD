const { Joi, objectId, pagination, latitude, longitude } = require('./common');
const { VOLUNTEER_SKILLS } = require('../config/constants');

const userIdParam = Joi.object({ userId: objectId.required() });

const updateProfile = Joi.object({
  skills: Joi.array()
    .items(Joi.string().uppercase().valid(...VOLUNTEER_SKILLS))
    .unique()
    .min(1)
    .max(VOLUNTEER_SKILLS.length)
    .required(),
});

const availability = Joi.object({ isAvailable: Joi.boolean().required() });

const location = Joi.object({
  latitude: latitude.required(),
  longitude: longitude.required(),
});

const adminUpdate = Joi.object({
  isVerified: Joi.boolean(),
  maxActiveAssignments: Joi.number().integer().min(1).max(5),
}).or('isVerified', 'maxActiveAssignments');

const list = Joi.object({
  isAvailable: Joi.boolean(),
  isVerified: Joi.boolean(),
  skill: Joi.string().uppercase().valid(...VOLUNTEER_SKILLS),
  ...pagination,
});

module.exports = { userIdParam, updateProfile, availability, location, adminUpdate, list };