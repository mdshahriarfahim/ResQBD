/**
 * services/adminService.js
 * ------------------------
 * Admin command center-এর ডেটা: statistics আর map data।
 */
const Incident = require('../models/Incident');
const VolunteerProfile = require('../models/VolunteerProfile');
const Assignment = require('../models/Assignment');
const priorityService = require('./priorityService');
const matchingService = require('./matchingService');
const { OPEN_STATUSES, INCIDENT_STATUS: IS, ASSIGNMENT_STATUS: AS } = require('../config/constants');

const groupCount = async (field, match = {}) => {
  const rows = await Incident.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return rows.reduce((acc, row) => {
    if (row._id) acc[row._id] = row.count;
    return acc;
  }, {});
};

const average = (numbers) =>
  numbers.length === 0 ? null : Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 10) / 10;

const getDashboard = async () => {
  const [byStatus, byType, byPriorityLevel, volunteersTotal, volunteersVerified, volunteersAvailable, volunteersBusy, offersPending] =
    await Promise.all([
      groupCount('status'),
      groupCount('type', { status: { $in: OPEN_STATUSES } }),
      groupCount('priority.level', { status: { $in: OPEN_STATUSES } }),
      VolunteerProfile.countDocuments({}),
      VolunteerProfile.countDocuments({ isVerified: true }),
      VolunteerProfile.countDocuments({ isVerified: true, isAvailable: true }),
      VolunteerProfile.countDocuments({ activeAssignmentCount: { $gt: 0 } }),
      Assignment.countDocuments({ status: AS.OFFERED }),
    ]);

  const openTotal = OPEN_STATUSES.reduce((sum, s) => sum + (byStatus[s] || 0), 0);

  // সাম্প্রতিক শেষ হওয়া incident-গুলার গড় সময়
  const recent = await Incident.find({ acceptedAt: { $exists: true } })
    .sort({ createdAt: -1 })
    .limit(200)
    .select('createdAt acceptedAt resolvedAt')
    .lean();

  const minutes = (later, earlier) => (new Date(later) - new Date(earlier)) / 60000;

  return {
    incidents: {
      openTotal,
      byStatus,
      openByType: byType,
      openByPriorityLevel: byPriorityLevel,
      needsAttention: byStatus[IS.ESCALATED] || 0,
    },
    volunteers: {
      total: volunteersTotal,
      verified: volunteersVerified,
      availableNow: volunteersAvailable,
      busyNow: volunteersBusy,
      offersWaitingForAnswer: offersPending,
    },
    performance: {
      averageMinutesToAccept: average(recent.map((i) => minutes(i.acceptedAt, i.createdAt))),
      averageMinutesToResolve: average(
        recent.filter((i) => i.resolvedAt).map((i) => minutes(i.resolvedAt, i.createdAt))
      ),
      sampleSize: recent.length,
    },
  };
};

/** Live map-এর জন্য open incident-এর ছোট লিস্ট। */
const getMapIncidents = async () => {
  const items = await Incident.find({ status: { $in: OPEN_STATUSES } })
    .select('trackingId type severity status priority.score priority.level location createdAt')
    .sort({ 'priority.score': -1 })
    .limit(500)
    .lean();
  return { items };
};

/** Live map-এর জন্য volunteer-দের অবস্থান (শুধু admin)। */
const getMapVolunteers = async () => {
  const items = await VolunteerProfile.find({
    isVerified: true,
    'currentLocation.lat': { $exists: true },
  })
    .populate('user', 'name phone')
    .select('user skills isAvailable activeAssignmentCount currentLocation')
    .limit(500)
    .lean();
  return { items };
};

/** ঠিক কোন formula আর নাম্বার ব্যবহার হচ্ছে তা দেখায় (transparency/documentation-এর জন্য)। */
const getScoringConfig = () => ({
  priority: priorityService.config,
  matching: matchingService.config,
});

module.exports = { getDashboard, getMapIncidents, getMapVolunteers, getScoringConfig };