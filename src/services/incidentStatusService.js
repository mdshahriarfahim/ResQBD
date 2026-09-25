/**
 * services/incidentStatusService.js
 * ---------------------------------
 * এটাই একমাত্র জায়গা যেখানে একটা incident-এর status বদলানো হয়।
 *
 * এটা নিশ্চিত করে যে:
 *   ১. বদলটা অনুমোদিত (config/constants.js-এর state machine অনুযায়ী),
 *   ২. বদলটা atomic (দুইটা request একসাথে এলেও শুধু একটা জিতবে),
 *   ৩. প্রতিটা বদল status log-এ লেখা হয় (timeline / audit trail),
 *   ৪. frontend-কে real time-এ জানানো হয়,
 *   ৫. যে citizen রিপোর্ট করেছে তাকে notification পাঠানো হয়।
 */
const Incident = require('../models/Incident');
const IncidentStatusLog = require('../models/IncidentStatusLog');
const notificationService = require('./notificationService');
const realtime = require('../socket');
const ApiError = require('../utils/ApiError');
const { STATUS_TRANSITIONS } = require('../config/constants');

const canTransition = (from, to) => (STATUS_TRANSITIONS[from] || []).includes(to);

// status বদলালে citizen-কে যে বার্তা পাঠানো হবে
const REPORTER_MESSAGES = {
  ASSIGNED: 'আপনার emergency-র priority ঠিক করা হয়েছে এবং কাছাকাছি volunteer-দের জানানো হয়েছে।',
  ACCEPTED: 'একজন volunteer আপনার emergency accept করেছেন, তিনি আপনার লোকেশনের দিকে আসছেন।',
  EN_ROUTE: 'Volunteer আপনার লোকেশনের দিকে আসছেন।',
  ON_SCENE: 'Volunteer জায়গায় পৌঁছে গেছেন।',
  RESOLVED: 'আপনার emergency-র সাড়া সম্পন্ন হয়েছে।',
  CLOSED: 'আপনার incident report বন্ধ করা হয়েছে।',
  CANCELLED: 'আপনার incident report বাতিল করা হয়েছে।',
};

/**
 * যেকোনো সফল status change-এর পর কল হয়: log লেখে, real-time event
 * পাঠায় এবং reporter-কে notify করে।
 */
const afterChange = async (updatedIncident, from, { actor = null, note = '' } = {}) => {
  await IncidentStatusLog.create({
    incident: updatedIncident._id,
    fromStatus: from,
    toStatus: updatedIncident.status,
    changedBy: actor ? actor._id : null,
    changedByRole: actor ? actor.role : 'SYSTEM',
    note,
  });

  realtime.emitIncidentUpdated(updatedIncident);

  const message = REPORTER_MESSAGES[updatedIncident.status];
  const reporterIsActor = actor && String(actor._id) === String(updatedIncident.reporter);
  if (message && !reporterIsActor) {
    await notificationService.notify({
      user: updatedIncident.reporter,
      type: 'INCIDENT_STATUS_CHANGED',
      title: `Incident ${updatedIncident.trackingId}: ${updatedIncident.status.replace('_', ' ')}`,
      message,
      incident: updatedIncident._id,
    });
  }
};

/**
 * একটা incident-কে নতুন status-এ নিয়ে যায়।
 * @param {object} incident  বর্তমান incident document (এর `status`-ই আগের status ধরা হয়)
 * @param {string} toStatus
 * @param {object} options   { actor, note, set } - `set` = একসাথে আপডেট হবে এমন বাড়তি ফিল্ড
 */
const transition = async (incident, toStatus, { actor = null, note = '', set = {} } = {}) => {
  const from = incident.status;

  if (!canTransition(from, toStatus)) {
    throw ApiError.badRequest(`Incident-এর status ${from} থেকে ${toStatus}-এ বদলানো যাবে না`);
  }

  // Conditional update: শুধু তখনই সফল হবে যদি status এখনো আমরা যা ভাবছি তাই থাকে
  const updated = await Incident.findOneAndUpdate(
    { _id: incident._id, status: from },
    { $set: { ...set, status: toStatus } },
    { returnDocument: 'after' }
  );

  if (!updated) {
    throw ApiError.conflict('এই incident-টা এইমাত্র অন্য কেউ আপডেট করেছে। রিফ্রেশ করে আবার চেষ্টা করুন');
  }

  await afterChange(updated, from, { actor, note });
  return updated;
};

module.exports = { transition, afterChange, canTransition };