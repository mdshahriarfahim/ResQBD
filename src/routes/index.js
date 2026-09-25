/**
 * routes/index.js
 * ---------------
 * সব route এক জায়গায় একসাথে জোড়া লাগে। app.js পুরো ফাইলটাকে "/api"-তে
 * mount করবে। প্রতিটা module-এর জন্য এখানে একটা লাইন যথেষ্ট।
 */
const express = require('express');

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const incidentRoutes = require('./incidentRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/incidents', incidentRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;