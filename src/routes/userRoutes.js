const express = require('express');
const controller = require('../controllers/userController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');
const v = require('../validations/userValidation');

const router = express.Router();
router.use(protect);

// PATCH /api/users/me   (যেকোনো লগইন করা user)
router.patch('/me', validate({ body: v.updateMe }), controller.updateMe);

// শুধু admin
router.get('/', authorize(ROLES.ADMIN), validate({ query: v.list }), controller.list);
router.get('/:id', authorize(ROLES.ADMIN), validate({ params: v.idParam }), controller.getById);
router.patch('/:id/status', authorize(ROLES.ADMIN), validate({ params: v.idParam, body: v.setActive }), controller.setActive);
router.patch('/:id/role', authorize(ROLES.ADMIN), validate({ params: v.idParam, body: v.setRole }), controller.setRole);

module.exports = router;