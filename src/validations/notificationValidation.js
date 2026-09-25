const { Joi, idParam, pagination } = require('./common');

const list = Joi.object({
  unreadOnly: Joi.boolean(),
  ...pagination,
});

module.exports = { idParam, list };