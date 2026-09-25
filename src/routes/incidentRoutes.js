const express = require('express');
const controller = require('../controllers/incidentController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { uploadIncidentImage, verifyImageContent } = require('../middleware/upload');
const { incidentLimiter } = require('../middleware/rateLimiters');
const { ROLES } = require('../config/constants');
const v = require('../validations/incidentValidation');

const router = express.Router();
router.use(protect);

// POST /api/incidents   (multipart/form-data, ঐচ্ছিক file field "image")
router.post(
  '/',
  authorize(ROLES.CITIZEN, ROLES.ADMIN),
  incidentLimiter,
  uploadIncidentImage,
  verifyImageContent,
  validate({ body: v.create }),
  controller.create
);

// GET /api/incidents/my   (অবশ্যই /:id-এর আগে থাকতে হবে)
router.get('/my', authorize(ROLES.CITIZEN), validate({ query: v.listMine }), controller.listMine);

// GET /api/incidents   (admin command center list)
router.get('/', authorize(ROLES.ADMIN), validate({ query: v.listAll }), controller.listAll);

// GET /api/incidents/:id   (id বা tracking id; access-এর নিয়ম service-এর ভেতরে)
router.get('/:id', validate({ params: v.idOrTrackingParam }), controller.getDetails);

// PATCH /api/incidents/:id/cancel
router.patch(
  '/:id/cancel',
  authorize(ROLES.CITIZEN, ROLES.ADMIN),
  validate({ params: v.idOrTrackingParam, body: v.cancel }),
  controller.cancel
);

// POST /api/incidents/:id/close   (admin একটা RESOLVED incident verify করে)
router.post('/:id/close', authorize(ROLES.ADMIN), validate({ params: v.idOrTrackingParam, body: v.close }), controller.close);

// POST /api/incidents/:id/rematch   (admin: escalation-এর পর আবার volunteer খোঁজে)
router.post('/:id/rematch', authorize(ROLES.ADMIN), validate({ params: v.idOrTrackingParam }), controller.rematch);

module.exports = router;