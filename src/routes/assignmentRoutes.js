const express = require('express');
const controller = require('../controllers/assignmentController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');
const v = require('../validations/assignmentValidation');

const router = express.Router();
router.use(protect);

// Volunteer
router.get('/my', authorize(ROLES.VOLUNTEER), validate({ query: v.listMine }), controller.listMine);

// Admin
router.get('/', authorize(ROLES.ADMIN), validate({ query: v.listAll }), controller.listAll);
router.post('/manual', authorize(ROLES.ADMIN), validate({ body: v.manual }), controller.manualAssign);

// Volunteer বা admin (মালিকানা service-এর ভেতরে চেক হয়)
router.get('/:id', authorize(ROLES.VOLUNTEER, ROLES.ADMIN), validate({ params: v.idParam }), controller.getById);

// Volunteer-এর কাজ
router.post('/:id/accept', authorize(ROLES.VOLUNTEER), validate({ params: v.idParam }), controller.accept);
router.post('/:id/decline', authorize(ROLES.VOLUNTEER), validate({ params: v.idParam, body: v.decline }), controller.decline);
router.patch('/:id/status', authorize(ROLES.VOLUNTEER), validate({ params: v.idParam, body: v.progress }), controller.updateProgress);
router.post('/:id/withdraw', authorize(ROLES.VOLUNTEER), validate({ params: v.idParam, body: v.withdraw }), controller.withdraw);

module.exports = router;