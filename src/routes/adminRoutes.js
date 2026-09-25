const express = require('express');
const controller = require('../controllers/adminController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');
const v = require('../validations/adminValidation');

const router = express.Router();

// /api/admin-এর সবকিছু শুধু admin-এর জন্য
router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', controller.dashboard);
router.get('/map/incidents', controller.mapIncidents);
router.get('/map/volunteers', controller.mapVolunteers);
router.get('/config/scoring', controller.scoringConfig);
router.get('/area-density', validate({ query: v.listDensity }), controller.listDensity);
router.post('/area-density', validate({ body: v.upsertDensity }), controller.upsertDensity);

module.exports = router;