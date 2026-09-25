const express = require('express');
const controller = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');
const v = require('../validations/authValidation');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authLimiter, validate({ body: v.register }), controller.register);
// POST /api/auth/login
router.post('/login', authLimiter, validate({ body: v.login }), controller.login);
// GET /api/auth/me
router.get('/me', protect, controller.me);
// POST /api/auth/change-password
router.post('/change-password', protect, validate({ body: v.changePassword }), controller.changePassword);

module.exports = router;