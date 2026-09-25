const express = require('express');
const controller = require('../controllers/volunteerController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');
const v = require('../validations/volunteerValidation');

const router = express.Router();
router.use(protect);

// Volunteer: নিজের profile (এইগুলো অবশ্যই /:userId রুটের ​আগে থাকতে হবে)
router.get('/me', authorize(ROLES.VOLUNTEER), controller.getMe);
router.patch('/me', authorize(ROLES.VOLUNTEER), validate({ body: v.updateProfile }), controller.updateMe);
router.patch('/me/availability', authorize(ROLES.VOLUNTEER), validate({ body: v.availability }), controller.setAvailability);
router.patch('/me/location', authorize(ROLES.VOLUNTEER), validate({ body: v.location }), controller.updateLocation);

// Admin
router.get('/', authorize(ROLES.ADMIN), validate({ query: v.list }), controller.list);
router.get('/:userId', authorize(ROLES.ADMIN), validate({ params: v.userIdParam }), controller.getByUserId);
router.patch('/:userId', authorize(ROLES.ADMIN), validate({ params: v.userIdParam, body: v.adminUpdate }), controller.adminUpdate);

module.exports = router;