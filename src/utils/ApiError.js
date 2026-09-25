/**
 * utils/ApiError.js
 * -----------------
 * Custom error class। কোথাও কিছু ভুল হলে (ভুল password, ডেটা না পাওয়া
 * ইত্যাদি) আমরা এই ক্লাস দিয়ে error "throw" করি, সাথে HTTP status code।
 * এই error শেষমেশ middleware/errorHandler.js গিয়ে ধরে।
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError(400, message, errors);
  }
  static unauthorized(message) {
    return new ApiError(401, message);
  }
  static forbidden(message) {
    return new ApiError(403, message);
  }
  static notFound(message) {
    return new ApiError(404, message);
  }
  static conflict(message) {
    return new ApiError(409, message);
  }
}

module.exports = ApiError;