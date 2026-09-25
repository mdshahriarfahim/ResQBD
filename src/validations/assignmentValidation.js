const { Joi, objectId, idParam, pagination } = require('./common');
const { ASSIGNMENT_STATUS } = require('../config/constants');

const listMine = Joi.object({
  status: Joi.string().uppercase().valid(...Object.values(ASSIGNMENT_STATUS)),
  ...pagination,
});

const listAll = Joi.object({
  status: Joi.string().uppercase().valid(...Object.values(ASSIGNMENT_STATUS)),
  incidentId: objectId,
  volunteerId: objectId,
  ...pagination,
});

const decline = Joi.object({ reason: Joi.string().trim().max(300).empty('') });

const progress = Joi.object({
  status: Joi.string().uppercase().valid('EN_ROUTE', 'ON_SCENE', 'COMPLETED').required(),
  note: Joi.string().trim().max(300).empty(''),
});

const withdraw = Joi.object({ reason: Joi.string().trim().min(3).max(300).required() });

const manual = Joi.object({
  incidentId: objectId.required(),
  volunteerId: objectId.required(),
});

module.exports = { idParam, listMine, listAll, decline, progress, withdraw, manual };