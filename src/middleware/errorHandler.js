/**
 * errorHandler middleware
 * -----------------------
 * সিস্টেমের সব error শেষমেশ এখানেই আসে। route, controller, বা service-এ
 * কোনো error থ্রো হলে সেটা এখানে ধরা পড়ে।
 *
 * প্রতিটা error response একই ফরম্যাটে হয়:
 *
 *   {
 *     "success": false,
 *     "message": "কী ভুল হয়েছে",
 *     "errors": [ ... ],          // শুধু বিস্তারিত error থাকলে
 *     "stack": "..."              // শুধু development-এ, কখনো production-এ না
 *   }
 *
 * Express একটা error handler চেনে তার ৪টা প্যারামিটার দেখে (err, req, res, next)।
 * `next` ব্যবহার না হলেও এটা মুছে ফেলা যাবে না।
 */
const multer = require('multer');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    // আমরা নিজেরাই ইচ্ছাকৃতভাবে থ্রো করা error
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body-তে অবৈধ JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body অনেক বড়';
  } else if (err instanceof multer.MulterError) {
    // ফাইল আপলোডের সমস্যা
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      message = `ছবির সাইজ অনেক বড়। সর্বোচ্চ সাইজ ${config.maxUploadMb} MB`;
    } else {
      statusCode = 400;
      message = `আপলোড error: ${err.message}`;
    }
  } else if (err.name === 'ValidationError' && err.errors) {
    // Mongoose schema validation
    statusCode = 400;
    message = 'Validation ব্যর্থ হয়েছে';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    // যেমন URL-এ অবৈধ ObjectId
    statusCode = 400;
    message = `${err.path}-এর ভ্যালু অবৈধ`;
  } else if (err.code === 11000) {
    // unique field-এ duplicate ভ্যালু
    statusCode = 409;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'value';
    message = `এই ${field} দিয়ে ইতিমধ্যে একটা রেকর্ড আছে`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid অথবা expired token';
  } else {
    // অজানা error = সম্ভবত একটা bug। লগ করে রাখা হচ্ছে যাতে পরে ঠিক করা যায়।
    console.error('Unexpected error:', err);
  }

  const response = { success: false, message };

  if (errors.length > 0) {
    response.errors = errors;
  }

  // development-এ stack trace সাহায্য করে, কিন্তু production-এ কখনো দেখানো যাবে না
  if (!config.isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;