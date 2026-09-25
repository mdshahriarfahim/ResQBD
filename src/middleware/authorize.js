/**
 * middleware/authorize.js
 * -----------------------
 * Role চেক করে। অবশ্যই `protect`-এর পরে ব্যবহার করতে হবে।
 *
 *   router.get('/', protect, authorize(ROLES.ADMIN), controller.list);
 */
const ApiError = require('../utils/ApiError');

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('এই কাজটা করার অনুমতি আপনার নেই'));
    }
    return next();
  };

module.exports = authorize;