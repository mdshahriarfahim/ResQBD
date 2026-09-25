/**
 * utils/apiResponse.js
 * --------------------
 * সফল রেসপন্স পাঠানোর জন্য helper — যাতে প্রতিটা controller-এ বারবার
 * একই { success, message, data } ফরম্যাট হাতে লিখতে না হয়।
 */
const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {} } = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

module.exports = { sendSuccess };