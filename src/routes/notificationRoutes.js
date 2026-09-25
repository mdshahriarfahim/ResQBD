const express = require('express');
const controller = require('../controllers/notificationController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const v = require('../validations/notificationValidation');

const router = express.Router();
router.use(protect);

router.get('/', validate({ query: v.list }), controller.list);
router.get('/unread-count', controller.unreadCount);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', validate({ params: v.idParam }), controller.markRead);

module.exports = router;