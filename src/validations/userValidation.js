const { Joi, idParam, pagination } = require('./common');
const { ROLES } = require('../config/constants');

const list = Joi.object({
  role: Joi.string().uppercase().valid(...Object.values(ROLES)),
  isActive: Joi.boolean(),
  search: Joi.string().trim().max(60),
  ...pagination,
});

const updateMe = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }),
}).or('name', 'email');

const setActive = Joi.object({ isActive: Joi.boolean().required() });

const setRole = Joi.object({
  role: Joi.string().uppercase().valid(...Object.values(ROLES)).required(),
});

module.exports = { idParam, list, updateMe, setActive, setRole };