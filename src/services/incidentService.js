/**
 * services/incidentService.js
 * ---------------------------
 * Incident (emergency report) নিয়ে business logic।
 *
 * একটা incident তৈরি করলে পুরো pipeline নিজে থেকেই চলে:
 *   report -> save -> priority score -> volunteer matching -> অফার পাঠানো
 */
const Incident = require('../models/Incident');
const IncidentStatusLog = require('../models/IncidentStatusLog');
const Assignment = require('../models/Assignment');
const priorityService = require('./priorityService');
const assignmentService = require('./assignmentService');
const statusService = require('./incidentStatusService');
const notificationService = require('./notificationService');
const realtime = require('../socket');
const ApiError = require('../utils/ApiError');
const { generateTrackingId, TRACKING_ID_REGEX } = require('../utils/trackingId');
const { getPagination, buildPageInfo } = require('../utils/pagination');
const { escapeRegex } = require('../utils/regex');
const { ROLES, INCIDENT_STATUS: IS, ASSIGNMENT_STATUS: AS } = require('../config/constants');

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const label = (text) => String(text).replace(/_/g, ' ').toLowerCase();

/* ------------------------------------------------------------------ */
/* তৈরি করা (Create)                                                    */
/* ------------------------------------------------------------------ */

const createIncident = async (user, payload, file) => {
  const { type, severity, description, latitude, longitude, address, district, upazila } = payload;

  // ১. রিপোর্ট সেভ করা (tracking ID মিলে গেলে খুবই বিরল ক্ষেত্রে আবার চেষ্টা করা হয়)
  let incident;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      incident = await Incident.create({
        trackingId: generateTrackingId(),
        reporter: user._id,
        type,
        severity,
        description,
        location: { lat: latitude, lng: longitude, address, district, upazila },
        image: file ? { url: `/uploads/incidents/${file.filename}`, filename: file.filename } : undefined,
        status: IS.REPORTED,
      });
      break;
    } catch (err) {
      const isTrackingCollision = err.code === 11000 && err.keyPattern && err.keyPattern.trackingId;
      if (!isTrackingCollision || attempt === 4) throw err;
    }
  }

  await IncidentStatusLog.create({
    incident: incident._id,
    fromStatus: null,
    toStatus: IS.REPORTED,
    changedBy: user._id,
    changedByRole: user.role,
    note: 'Incident রিপোর্ট করা হয়েছে',
  });

  // ২. Explainable priority score
  const priority = await priorityService.calculateForIncident(incident);
  incident = await Incident.findByIdAndUpdate(
    incident._id,
    { $set: { priority } },
    { returnDocument: 'after' }
  );
  incident = await statusService.transition(incident, IS.PRIORITIZED, {
    note: `Priority হিসেব হয়েছে: ${priority.explanation}`,
  });

  realtime.emitIncidentCreated(incident);
  await notificationService.notifyAdmins({
    type: 'INCIDENT_CREATED',
    title: `নতুন ${incident.priority.level} incident ${incident.trackingId}`,
    message: `${label(incident.type)} রিপোর্ট হয়েছে (severity ${incident.severity})। ${incident.priority.explanation}`,
    incident: incident._id,
  });

  // ৩. Volunteer matching। technical কারণে fail করলেও রিপোর্টটা সেভ থাকবে,
  //    background job পরে আবার চেষ্টা করবে (দেখো retryUndispatched)।
  try {
    await assignmentService.dispatch(incident, { trigger: 'NEW_INCIDENT' });
  } catch (err) {
    console.error(`${incident.trackingId}-এর matching ব্যর্থ হয়েছে:`, err.message);
  }

  return Incident.findById(incident._id);
};

/* ------------------------------------------------------------------ */
/* পড়া (Read)                                                          */
/* ------------------------------------------------------------------ */

const findByIdOrTrackingId = async (value) => {
  if (OBJECT_ID_REGEX.test(value)) return Incident.findById(value);
  const upper = String(value).toUpperCase();
  if (TRACKING_ID_REGEX.test(upper)) return Incident.findOne({ trackingId: upper });
  return null;
};

/**
 * কে কোন incident দেখতে পারবে?
 *   ADMIN     - সব incident
 *   CITIZEN   - শুধু নিজে রিপোর্ট করা incident
 *   VOLUNTEER - শুধু যেগুলোর জন্য তাকে অফার/assign করা হয়েছে
 * অন্য কেউ হলে "not found" দেখানো হয় (আমরা প্রকাশ করি না যে এটা আসলে আছে)।
 */
const getDetails = async (idOrTrackingId, user) => {
  const incident = await findByIdOrTrackingId(idOrTrackingId);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');

  const timeline = await IncidentStatusLog.find({ incident: incident._id })
    .sort({ createdAt: 1 })
    .select('fromStatus toStatus changedByRole note createdAt')
    .lean();

  if (user.role === ROLES.ADMIN) {
    const [full, assignments] = await Promise.all([
      Incident.findById(incident._id).populate('reporter', 'name phone').lean(),
      Assignment.find({ incident: incident._id })
        .populate('volunteer', 'name phone')
        .sort({ createdAt: 1 })
        .lean(),
    ]);
    return { incident: full, timeline, assignments };
  }

  if (user.role === ROLES.CITIZEN) {
    if (String(incident.reporter) !== String(user._id)) throw ApiError.notFound('Incident পাওয়া যায়নি');

    const active = incident.activeAssignment
      ? await Assignment.findById(incident.activeAssignment).populate('volunteer', 'name').lean()
      : null;

    return {
      incident: incident.toObject(),
      timeline,
      assignedVolunteer: active
        ? { name: active.volunteer && active.volunteer.name, status: active.status, distanceKm: active.distanceKm }
        : null,
    };
  }

  // VOLUNTEER
  const mine = await Assignment.findOne({ incident: incident._id, volunteer: user._id })
    .sort({ createdAt: -1 })
    .lean();
  if (!mine) throw ApiError.notFound('Incident পাওয়া যায়নি');

  const data = incident.toObject();
  const canSeeContact = [AS.ACCEPTED, AS.EN_ROUTE, AS.ON_SCENE, AS.COMPLETED].includes(mine.status);
  if (canSeeContact) {
    const reporter = await Incident.findById(incident._id).populate('reporter', 'name phone').lean();
    data.reporter = reporter.reporter;
  } else {
    delete data.reporter;
  }
  return { incident: data, timeline, assignment: mine };
};

const listMine = async (user, { status, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = { reporter: user._id };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Incident.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Incident.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

/** Admin list, ফিল্টার সহ (command center table)। */
const listAll = async (query = {}) => {
  const { status, type, severity, priorityLevel, district, search, from, to, sort = 'priority' } = query;
  const pagination = getPagination(query);
  const filter = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (severity) filter.severity = severity;
  if (priorityLevel) filter['priority.level'] = priorityLevel;
  if (district) filter['location.district'] = new RegExp(`^${escapeRegex(district)}$`, 'i');
  if (search) filter.trackingId = new RegExp(`^${escapeRegex(search.toUpperCase())}`);
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = from;
    if (to) filter.createdAt.$lte = to;
  }

  const sortBy = {
    priority: { 'priority.score': -1, createdAt: 1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  }[sort];

  const [items, total] = await Promise.all([
    Incident.find(filter)
      .populate('reporter', 'name phone')
      .sort(sortBy)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Incident.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

/* ------------------------------------------------------------------ */
/* বদল (Change)                                                        */
/* ------------------------------------------------------------------ */

const cancel = async (idOrTrackingId, user, reason) => {
  const incident = await findByIdOrTrackingId(idOrTrackingId);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');

  const isOwner = String(incident.reporter) === String(user._id);
  if (user.role !== ROLES.ADMIN && !isOwner) throw ApiError.notFound('Incident পাওয়া যায়নি');

  const updated = await statusService.transition(incident, IS.CANCELLED, {
    actor: user,
    note: reason ? `Cancel করা হয়েছে: ${reason}` : 'Cancel করা হয়েছে',
    set: { cancelledAt: new Date(), cancelReason: reason },
  });

  await assignmentService.cancelAllForIncident(updated, reason);
  return updated;
};

/** Admin নিশ্চিত করে যে একটা RESOLVED incident সত্যিই শেষ হয়েছে। */
const close = async (idOrTrackingId, admin, note) => {
  const incident = await findByIdOrTrackingId(idOrTrackingId);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');

  return statusService.transition(incident, IS.CLOSED, {
    actor: admin,
    note: note || 'Admin দ্বারা closed',
    set: { closedAt: new Date() },
  });
};

/** Escalation-এর পর admin আবার volunteer খোঁজার অনুরোধ করে। */
const rematch = async (idOrTrackingId, admin) => {
  const incident = await findByIdOrTrackingId(idOrTrackingId);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');
  if (incident.status !== IS.ESCALATED) {
    throw ApiError.conflict('শুধু escalated incident-ই আবার matching করা যাবে');
  }

  const fresh = await Incident.findByIdAndUpdate(
    incident._id,
    { $set: { matchAttempts: 0 } },
    { returnDocument: 'after' }
  );
  return assignmentService.dispatch(fresh, { actor: admin, trigger: 'ADMIN_RETRY' });
};

/**
 * Background job: কোনো সাময়িক error-এর কারণে যেন একটা incident "আটকে"
 * না থাকে।
 *  - PRIORITIZED-এ ১ মিনিটের বেশি থাকলে -> matching কখনো শুরুই হয়নি
 *  - MATCHING-এ ৩ মিনিটের বেশি থাকলে   -> matching মাঝপথে crash করেছে
 */
const retryUndispatched = async (now = new Date()) => {
  const stuck = await Incident.find({
    $or: [
      { status: IS.PRIORITIZED, updatedAt: { $lt: new Date(now.getTime() - 60 * 1000) } },
      { status: IS.MATCHING, updatedAt: { $lt: new Date(now.getTime() - 3 * 60 * 1000) } },
    ],
  }).limit(50);

  for (const incident of stuck) {
    try {
      await assignmentService.dispatch(incident, { trigger: 'RETRY' });
    } catch (err) {
      console.error(`${incident.trackingId}-এর retry matching ব্যর্থ হয়েছে:`, err.message);
    }
  }
  return stuck.length;
};

module.exports = {
  createIncident,
  getDetails,
  listMine,
  listAll,
  cancel,
  close,
  rematch,
  retryUndispatched,
};