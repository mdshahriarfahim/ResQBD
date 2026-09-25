/**
 * middleware/validate.js
 * ----------------------
 * Controller চলার আগে Joi schema দিয়ে request data validate করে।
 *
 *   validate({ body: registerSchema })
 *   validate({ query: listSchema, params: idParamSchema })
 *
 * - অজানা ফিল্ড বাদ দেওয়া হয় (stripUnknown), যাতে কেউ { role: 'ADMIN' }-এর
 *   মতো বাড়তি ফিল্ড ঢোকাতে না পারে।
 * - ভ্যালু ঠিক টাইপে বদলে যায় ("5" -> 5)।
 * - পরিষ্কার ভ্যালু req.body-তে সেভ হয়, আর req.validated.query / req.validated.params-এ।
 */
const fs = require('fs');
const ApiError = require('../utils/ApiError');

const JOI_OPTIONS = { abortEarly: false, stripUnknown: true, convert: true };

const validate = (schemas) => (req, res, next) => {
  const errors = [];
  req.validated = req.validated || {};

  ['body', 'query', 'params'].forEach((part) => {
    if (!schemas[part]) return;

    const { value, error } = schemas[part].validate(req[part] || {}, JOI_OPTIONS);

    if (error) {
      error.details.forEach((detail) => {
        errors.push({
          field: detail.path.join('.') || part,
          message: detail.message.replace(/"/g, ''),
        });
      });
    } else if (part === 'body') {
      req.body = value;
    } else {
      // Express 5-এ req.query আবার সেট করা যায় না, তাই এখানে আলাদা রাখা হয়েছে
      req.validated[part] = value;
    }
  });

  if (errors.length > 0) {
    // multer আগেই একটা ছবি সেভ করে ফেলতে পারে। validation fail করলে সেটা রাখা হবে না।
    if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
    return next(ApiError.badRequest('Validation ব্যর্থ হয়েছে', errors));
  }

  return next();
};

module.exports = validate;