const { Joi, pagination } = require('./common');

const upsertDensity = Joi.object({
  district: Joi.string().trim().min(2).max(60).required(),
  upazila: Joi.string().trim().max(60).empty(''),
  populationDensity: Joi.number().min(0).max(200000).required(),
  source: Joi.string().trim().max(120).empty(''),
});

const listDensity = Joi.object({
  search: Joi.string().trim().max(60),
  ...pagination,
});

module.exports = { upsertDensity, listDensity };