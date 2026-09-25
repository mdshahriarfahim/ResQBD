/**
 * services/assignmentService.js
 * -----------------------------
 * "কোন volunteer কোন incident সামলাচ্ছে" — এই সবকিছু এখানে।
 *
 * Flow:
 *   dispatch()      -> matching সবচেয়ে ভালো volunteer খুঁজে বের করে -> অফার তৈরি হয় (OFFERED)
 *   accept()        -> যে volunteer আগে accept করবে, incident-টা তারই হবে
 *   decline()       -> আর কেউ pending না থাকলে, পরের round নিজে থেকেই শুরু হয়
 *   expireStaleOffers() -> সময়মতো উত্তর না দিলে অফার expire হয় (background job)
 *   updateProgress()-> EN_ROUTE -> ON_SCENE -> COMPLETED (incident RESOLVED হয়)
 *   withdraw()      -> volunteer accept করার পর মাঝপথে সরে গেলে -> matching আবার শুরু হয়
 *
 * RACE CONDITION: দুইজন volunteer একই মুহূর্তে "accept" চাপতে পারে।
 *  - Incident claim করা হয় Assignment.claimKey-এর UNIQUE index দিয়ে, তাই
 *    ডাটাবেজ নিজেই জয়ী ঠিক করে। দুইজন volunteer কখনো একই incident পাবে না।
 *  - Volunteer-এর workload রক্ষা করা হয় conditional update দিয়ে
 *    ("maximum-এর নিচে থাকলে তবেই ১ যোগ করো")।
 */
const Assignment = require('../models/Assignment');
const Incident = require('../models/Incident');
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const matchingService = require('./matchingService');
const statusService = require('./incidentStatusService');
const notificationService = require('./notificationService');
const realtime = require('../socket');
const matchingConfig = require('../config/matching.config');
const ApiError = require('../utils/ApiError');
const { haversineKm } = require('../utils/haversine');
const { getPagination, buildPageInfo } = require('../utils/pagination');
const {
  ROLES,
  INCIDENT_STATUS: IS,
  ASSIGNMENT_STATUS: AS,
  ACTIVE_ASSIGNMENT_STATUSES,
} = require('../config/constants');

const label = (text) => String(text).replace(/_/g, ' ').toLowerCase();

// এই assignment status-গুলাতেই শুধু citizen-এর contact দেখা যাবে
const CONTACT_VISIBLE_STATUSES = [AS.ACCEPTED, AS.EN_ROUTE, AS.ON_SCENE, AS.COMPLETED];

const INCIDENT_FIELDS_FOR_VOLUNTEER =
  'trackingId type severity description location status priority image createdAt reporter';

/* ------------------------------------------------------------------ */
/* ছোট helper                                                          */
/* ------------------------------------------------------------------ */

/** volunteer-এর একটা workload slot ফেরত দেয় (কখনো ০-এর নিচে যাবে না) */
const releaseCapacity = (volunteerUserId) =>
  VolunteerProfile.updateOne(
    { user: volunteerUserId, activeAssignmentCount: { $gt: 0 } },
    { $inc: { activeAssignmentCount: -1 } }
  );

/** volunteer accept করার আগ পর্যন্ত citizen-এর ফোন নাম্বার লুকিয়ে রাখে */
const shapeForVolunteer = (assignment) => {
  const shaped = { ...assignment };
  if (shaped.incident && shaped.incident.reporter && !CONTACT_VISIBLE_STATUSES.includes(shaped.status)) {
    shaped.incident = { ...shaped.incident };
    delete shaped.incident.reporter;
  }
  return shaped;
};

const populateForVolunteer = (query) =>
  query.populate({
    path: 'incident',
    select: INCIDENT_FIELDS_FOR_VOLUNTEER,
    populate: { path: 'reporter', select: 'name phone' },
  });

/* ------------------------------------------------------------------ */
/* Dispatch (matching + offer)                                         */
/* ------------------------------------------------------------------ */

const escalate = async (incident, reason, actor = null) => {
  let updated = incident;

  if (incident.status !== IS.ESCALATED) {
    updated = await statusService.transition(incident, IS.ESCALATED, {
      actor,
      note: reason,
      set: { escalationReason: reason },
    });
  } else {
    updated = await Incident.findByIdAndUpdate(
      incident._id,
      { $set: { escalationReason: reason } },
      { returnDocument: 'after' }
    );
  }

  await notificationService.notifyAdmins({
    type: 'INCIDENT_ESCALATED',
    title: `Incident ${incident.trackingId}-এর জন্য admin লাগবে`,
    message: `${reason}। দয়া করে হাতে volunteer assign করুন।`,
    incident: incident._id,
  });

  return { incident: updated, assignments: [], offered: 0 };
};

/**
 * সবচেয়ে ভালো volunteer খুঁজে অফার পাঠায়।
 * @param {object} incidentInput incident document (status PRIORITIZED, ASSIGNED বা ESCALATED)
 */
const dispatch = async (incidentInput, { actor = null, trigger = 'AUTO' } = {}) => {
  let incident = incidentInput;

  if (incident.matchAttempts >= matchingConfig.maxMatchingRounds) {
    return escalate(
      incident,
      `${matchingConfig.maxMatchingRounds} বার matching round চেষ্টা করেও কেউ accept করেনি`,
      actor
    );
  }

  if (incident.status !== IS.MATCHING) {
    incident = await statusService.transition(incident, IS.MATCHING, {
      actor,
      note: `Volunteer matching শুরু হয়েছে (${trigger})`,
    });
  }

  // এই incident-এ যাদের আগেই অফার করা হয়েছে, তাদের আবার অফার করা হবে না
  const previous = await Assignment.find({ incident: incident._id }).select('volunteer').lean();
  const excludeUserIds = previous.map((a) => a.volunteer);

  const { radiusKm, candidates } = await matchingService.findCandidates(incident, { excludeUserIds });

  if (candidates.length === 0) {
    return escalate(
      incident,
      `${radiusKm} কিমি-এর মধ্যে উপযুক্ত কোনো available volunteer পাওয়া যায়নি`,
      actor
    );
  }

  const chosen = candidates.slice(0, matchingConfig.maxOffersPerRound);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + matchingConfig.offerExpiryMinutes * 60000);
  const round = incident.matchAttempts + 1;

  const assignments = await Assignment.insertMany(
    chosen.map((c) => ({
      incident: incident._id,
      volunteer: c.user,
      status: AS.OFFERED,
      distanceKm: c.distanceKm,
      matchScore: c.matchScore,
      matchBreakdown: c.breakdown,
      round,
      offeredBy: 'SYSTEM',
      offeredAt: now,
      expiresAt,
    }))
  );

  incident = await Incident.findByIdAndUpdate(
    incident._id,
    { $inc: { matchAttempts: 1 } },
    { returnDocument: 'after' }
  );

  incident = await statusService.transition(incident, IS.ASSIGNED, {
    actor,
    note: `${assignments.length} জন volunteer-কে অফার করা হয়েছে, round ${round}, search radius ${radiusKm} কিমি`,
  });

  await Promise.all(
    assignments.map((assignment) => {
      realtime.emitAssignmentUpdated(assignment);
      return notificationService.notify({
        user: assignment.volunteer,
        type: 'ASSIGNMENT_OFFERED',
        title: 'কাছাকাছি নতুন emergency',
        message: `${label(incident.type)} (${incident.severity}), প্রায় ${assignment.distanceKm} কিমি দূরে। দয়া করে ${matchingConfig.offerExpiryMinutes} মিনিটের মধ্যে সাড়া দিন।`,
        incident: incident._id,
        assignment: assignment._id,
      });
    })
  );

  return { incident, assignments, offered: assignments.length, radiusKm };
};

/**
 * অফার decline বা expire হলে কল হয়। আর কেউ accept করার মতো না থাকলে,
 * পরের matching round নিজে থেকেই শুরু হয়।
 */
const afterOfferResolved = async (incidentId) => {
  const incident = await Incident.findById(incidentId);
  if (!incident || incident.status !== IS.ASSIGNED || incident.activeAssignment) return;

  const pending = await Assignment.countDocuments({ incident: incidentId, status: AS.OFFERED });
  if (pending > 0) return;

  await dispatch(incident, { trigger: 'NEXT_ROUND' });
};

/** Admin হাতে volunteer বেছে দেয় (যেমন escalation-এর পর) */
const manualAssign = async ({ incidentId, volunteerId }, admin) => {
  const incident = await Incident.findById(incidentId);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');

  if (![IS.PRIORITIZED, IS.MATCHING, IS.ASSIGNED, IS.ESCALATED].includes(incident.status)) {
    throw ApiError.conflict(`${incident.status} status-এর incident-কে assign করা যাবে না`);
  }

  const volunteerUser = await User.findOne({ _id: volunteerId, role: ROLES.VOLUNTEER, isActive: true });
  if (!volunteerUser) throw ApiError.notFound('Volunteer পাওয়া যায়নি');

  const profile = await VolunteerProfile.findOne({ user: volunteerId });
  if (!profile || !profile.isVerified) throw ApiError.badRequest('এই volunteer এখনো verified না');

  const existing = await Assignment.findOne({
    incident: incident._id,
    volunteer: volunteerId,
    status: { $in: [AS.OFFERED, ...ACTIVE_ASSIGNMENT_STATUSES] },
  });
  if (existing) throw ApiError.conflict('এই volunteer-এর এই incident-এ ইতিমধ্যে একটা assignment আছে');

  const now = new Date();
  let distanceKm;
  if (profile.currentLocation && profile.currentLocation.lat !== undefined) {
    distanceKm =
      Math.round(
        haversineKm(
          incident.location.lat,
          incident.location.lng,
          profile.currentLocation.lat,
          profile.currentLocation.lng
        ) * 100
      ) / 100;
  }

  const assignment = await Assignment.create({
    incident: incident._id,
    volunteer: volunteerId,
    status: AS.OFFERED,
    distanceKm,
    matchBreakdown: { manual: true, summary: `Admin ${admin.name} হাতে assign করেছেন` },
    round: incident.matchAttempts + 1,
    offeredBy: 'ADMIN',
    offeredAt: now,
    expiresAt: new Date(now.getTime() + matchingConfig.offerExpiryMinutes * 60000),
  });

  let updatedIncident = incident;
  if (incident.status !== IS.ASSIGNED) {
    updatedIncident = await statusService.transition(incident, IS.ASSIGNED, {
      actor: admin,
      note: `${volunteerUser.name}-কে হাতে অফার করা হয়েছে`,
    });
  }

  realtime.emitAssignmentUpdated(assignment);
  await notificationService.notify({
    user: volunteerId,
    type: 'ASSIGNMENT_OFFERED',
    title: 'আপনাকে একটা emergency assign করা হয়েছে',
    message: `${label(incident.type)} (${incident.severity})। একজন admin এটা আপনাকে দিয়েছেন। দয়া করে ${matchingConfig.offerExpiryMinutes} মিনিটের মধ্যে সাড়া দিন।`,
    incident: incident._id,
    assignment: assignment._id,
  });

  return { incident: updatedIncident, assignment };
};

/* ------------------------------------------------------------------ */
/* Volunteer-এর কাজ                                                    */
/* ------------------------------------------------------------------ */

const findOwnAssignment = async (assignmentId, user) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment || String(assignment.volunteer) !== String(user._id)) {
    throw ApiError.notFound('Assignment পাওয়া যায়নি');
  }
  return assignment;
};

const accept = async (assignmentId, user) => {
  const assignment = await findOwnAssignment(assignmentId, user);

  if (assignment.status !== AS.OFFERED) {
    throw ApiError.conflict(`এই assignment ইতিমধ্যে ${assignment.status}`);
  }
  if (assignment.expiresAt && assignment.expiresAt < new Date()) {
    throw ApiError.conflict('এই অফারের সময় শেষ হয়ে গেছে');
  }

  const profile = await VolunteerProfile.findOne({ user: user._id });
  if (!profile || !profile.isVerified) throw ApiError.forbidden('আপনার volunteer account এখনো verified না');

  // Step ১: একটা workload slot claim করা (maximum-এ পৌঁছে গেলে fail হবে)
  const claimedProfile = await VolunteerProfile.findOneAndUpdate(
    { _id: profile._id, activeAssignmentCount: { $lt: profile.maxActiveAssignments } },
    { $inc: { activeAssignmentCount: 1 } },
    { returnDocument: 'after' }
  );
  if (!claimedProfile) {
    throw ApiError.conflict('আপনি ইতিমধ্যে সর্বোচ্চসংখ্যক active incident সামলাচ্ছেন');
  }

  const now = new Date();

  // Step ২: incident claim করা।
  // `claimKey`-তে UNIQUE index আছে: একটা incident-এর জন্য শুধু ONE
  // assignment-ই এটা ধরে রাখতে পারবে। অন্য volunteer আগে হলে ডাটাবেজ
  // নিজেই আমাদের আপডেট reject করে দেবে (duplicate key)।
  let accepted = null;
  let lostRace = false;
  try {
    accepted = await Assignment.findOneAndUpdate(
      { _id: assignment._id, status: AS.OFFERED },
      {
        $set: {
          status: AS.ACCEPTED,
          respondedAt: now,
          acceptedAt: now,
          claimKey: String(assignment.incident),
        },
      },
      { returnDocument: 'after' }
    );
  } catch (err) {
    // আসল MongoDB duplicate key হলে err.code === 11000 দেয়।
    const isDuplicateClaim = err.code === 11000 || /duplicate key|unique constraint/i.test(err.message || '');
    if (!isDuplicateClaim) {
      await releaseCapacity(user._id);
      throw err;
    }
    lostRace = true;
  }

  if (!accepted) {
    await releaseCapacity(user._id);
    if (lostRace) {
      await Assignment.updateOne(
        { _id: assignment._id, status: AS.OFFERED },
        { $set: { status: AS.CANCELLED, respondedAt: now, note: 'অন্য volunteer আগে accept করেছেন' } }
      );
      throw ApiError.conflict('অন্য একজন volunteer এই incident ইতিমধ্যে নিয়ে নিয়েছেন');
    }
    throw ApiError.conflict('এই অফার আর available না');
  }

  // Step ৩: আমরাই claim পেয়েছি, মানে আমরাই একমাত্র। এখন incident আপডেট করি।
  const incident = await Incident.findOneAndUpdate(
    { _id: assignment.incident, status: IS.ASSIGNED },
    { $set: { status: IS.ACCEPTED, activeAssignment: assignment._id, acceptedAt: now } },
    { returnDocument: 'after' }
  );

  if (!incident) {
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: { status: AS.CANCELLED, note: 'Incident আর open নেই' }, $unset: { claimKey: '' } }
    );
    await releaseCapacity(user._id);
    throw ApiError.conflict('এই incident আর open নেই');
  }

  // Step ৪: এই incident-এ যাদের আরও অফার করা ছিল, তাদের জানানো হচ্ছে যে হয়ে গেছে
  const others = await Assignment.find({
    incident: incident._id,
    _id: { $ne: assignment._id },
    status: AS.OFFERED,
  });
  if (others.length > 0) {
    await Assignment.updateMany(
      { _id: { $in: others.map((o) => o._id) }, status: AS.OFFERED },
      { $set: { status: AS.CANCELLED, respondedAt: now, note: 'অন্য volunteer আগে accept করেছেন' } }
    );
    await Promise.all(
      others.map((other) => {
        realtime.emitAssignmentUpdated({ ...other.toObject(), status: AS.CANCELLED });
        return notificationService.notify({
          user: other.volunteer,
          type: 'ASSIGNMENT_CANCELLED',
          title: 'Emergency ইতিমধ্যে নেওয়া হয়ে গেছে',
          message: `Incident ${incident.trackingId} অন্য একজন volunteer আগে accept করেছেন। রেডি থাকার জন্য ধন্যবাদ।`,
          incident: incident._id,
          assignment: other._id,
        });
      })
    );
  }

  await statusService.afterChange(incident, IS.ASSIGNED, {
    actor: user,
    note: `${user.name} assignment accept করেছেন`,
  });

  realtime.emitAssignmentUpdated(accepted);
  await notificationService.notifyAdmins({
    type: 'ASSIGNMENT_ACCEPTED',
    title: `${incident.trackingId} Volunteer accept করেছেন`,
    message: `${user.name} ${label(incident.type)} incident-টা accept করেছেন।`,
    incident: incident._id,
    assignment: accepted._id,
  });

  return { assignment: accepted, incident };
};

const decline = async (assignmentId, user, reason) => {
  const now = new Date();
  const updated = await Assignment.findOneAndUpdate(
    { _id: assignmentId, volunteer: user._id, status: AS.OFFERED },
    { $set: { status: AS.DECLINED, respondedAt: now, declineReason: reason } },
    { returnDocument: 'after' }
  );

  if (!updated) {
    const existing = await Assignment.findOne({ _id: assignmentId, volunteer: user._id });
    if (!existing) throw ApiError.notFound('Assignment পাওয়া যায়নি');
    throw ApiError.conflict(`এই assignment ইতিমধ্যে ${existing.status}`);
  }

  realtime.emitAssignmentUpdated(updated);

  // আর কেউ accept করার মতো না থাকলে পরের round শুরু হবে। এখানে fail
  // হলেও volunteer-এর decline ব্যর্থ হবে না; background job পরে আবার
  // চেষ্টা করবে।
  try {
    await afterOfferResolved(updated.incident);
  } catch (err) {
    console.error('পরের matching round শুরু করা যায়নি:', err.message);
  }

  return updated;
};

const NEXT_PROGRESS = {
  [AS.ACCEPTED]: AS.EN_ROUTE,
  [AS.EN_ROUTE]: AS.ON_SCENE,
  [AS.ON_SCENE]: AS.COMPLETED,
};
const PROGRESS_TIME_FIELD = {
  [AS.EN_ROUTE]: 'enRouteAt',
  [AS.ON_SCENE]: 'onSceneAt',
  [AS.COMPLETED]: 'completedAt',
};

const updateProgress = async (assignmentId, user, { status, note }) => {
  const assignment = await findOwnAssignment(assignmentId, user);

  if (NEXT_PROGRESS[assignment.status] !== status) {
    throw ApiError.badRequest(`Assignment-কে ${assignment.status} থেকে ${status}-এ বদলানো যাবে না`);
  }

  const incident = await Incident.findById(assignment.incident);
  if (!incident) throw ApiError.notFound('Incident পাওয়া যায়নি');

  const now = new Date();
  const incidentTarget = status === AS.COMPLETED ? IS.RESOLVED : status;
  const set = status === AS.COMPLETED ? { resolvedAt: now } : {};

  // আগে incident বদলানো হয় (এটাই gate, incident cancel হয়ে গেলে এখানেই আটকে যাবে)
  const updatedIncident = await statusService.transition(incident, incidentTarget, {
    actor: user,
    note: note || `Volunteer status: ${status}`,
    set,
  });

  const updated = await Assignment.findOneAndUpdate(
    { _id: assignment._id, volunteer: user._id, status: assignment.status },
    { $set: { status, [PROGRESS_TIME_FIELD[status]]: now, ...(note ? { note } : {}) } },
    { returnDocument: 'after' }
  );
  if (!updated) throw ApiError.conflict('এই assignment এইমাত্র বদলে গেছে। রিফ্রেশ করুন');

  if (status === AS.COMPLETED) {
    await VolunteerProfile.updateOne(
      { user: user._id, activeAssignmentCount: { $gt: 0 } },
      { $inc: { activeAssignmentCount: -1, totalCompleted: 1 } }
    );
    await notificationService.notifyAdmins({
      type: 'INCIDENT_STATUS_CHANGED',
      title: `Incident ${incident.trackingId} resolved হয়েছে`,
      message: `${user.name} সাড়া সম্পন্ন করেছেন। দয়া করে review করে incident close করুন।`,
      incident: incident._id,
    });
  }

  realtime.emitAssignmentUpdated(updated);
  return { assignment: updated, incident: updatedIncident };
};

/** Volunteer accept করার পর চালিয়ে যেতে পারছে না। incident আবার matching-এ যাবে। */
const withdraw = async (assignmentId, user, reason) => {
  const assignment = await findOwnAssignment(assignmentId, user);

  if (!ACTIVE_ASSIGNMENT_STATUSES.includes(assignment.status)) {
    throw ApiError.badRequest('শুধু accepted assignment-ই withdraw করা যাবে');
  }

  const updated = await Assignment.findOneAndUpdate(
    { _id: assignment._id, volunteer: user._id, status: assignment.status },
    { $set: { status: AS.WITHDRAWN, respondedAt: new Date(), note: reason }, $unset: { claimKey: '' } },
    { returnDocument: 'after' }
  );
  if (!updated) throw ApiError.conflict('এই assignment এইমাত্র বদলে গেছে। রিফ্রেশ করুন');

  await releaseCapacity(user._id);

  let incident = await Incident.findById(assignment.incident);
  if (incident) {
    incident = await statusService.transition(incident, IS.ESCALATED, {
      actor: user,
      note: `Volunteer withdraw করেছেন: ${reason}`,
      set: { activeAssignment: null, matchAttempts: 0, escalationReason: `Volunteer withdraw করেছেন: ${reason}` },
    });

    await notificationService.notifyAdmins({
      type: 'VOLUNTEER_WITHDRAWN',
      title: `${incident.trackingId}-এ volunteer withdraw করেছেন`,
      message: `${user.name} চালিয়ে যেতে পারছেন না: ${reason}। সিস্টেম নতুন volunteer খুঁজছে।`,
      incident: incident._id,
    });

    try {
      await dispatch(incident, { trigger: 'VOLUNTEER_WITHDREW' });
    } catch (err) {
      console.error('Withdraw-এর পর re-matching ব্যর্থ হয়েছে:', err.message);
    }
  }

  realtime.emitAssignmentUpdated(updated);
  return updated;
};

/* ------------------------------------------------------------------ */
/* System / cancellation                                              */
/* ------------------------------------------------------------------ */

/** কোনো incident cancel হলে, এর সব open অফার এবং চলমান কাজ বন্ধ হয়ে যায়। */
const cancelAllForIncident = async (incident, reason) => {
  const open = await Assignment.find({
    incident: incident._id,
    status: { $in: [AS.OFFERED, ...ACTIVE_ASSIGNMENT_STATUSES] },
  });

  for (const assignment of open) {
    const previousStatus = assignment.status;
    const updated = await Assignment.findOneAndUpdate(
      { _id: assignment._id, status: previousStatus },
      {
        $set: { status: AS.CANCELLED, respondedAt: new Date(), note: reason || 'Incident cancel হয়েছে' },
        $unset: { claimKey: '' },
      },
      { returnDocument: 'after' }
    );
    if (!updated) continue;

    if (ACTIVE_ASSIGNMENT_STATUSES.includes(previousStatus)) {
      await releaseCapacity(assignment.volunteer);
    }

    realtime.emitAssignmentUpdated(updated);
    await notificationService.notify({
      user: assignment.volunteer,
      type: 'ASSIGNMENT_CANCELLED',
      title: 'Emergency cancel হয়েছে',
      message: `Incident ${incident.trackingId} cancel হয়ে গেছে। আপনার সাড়া দেওয়ার দরকার নেই।`,
      incident: incident._id,
      assignment: assignment._id,
    });
  }

  return open.length;
};

/** Background job: সময়মতো উত্তর না দেওয়া অফার expire হয়ে যায়। */
const expireStaleOffers = async (now = new Date()) => {
  const stale = await Assignment.find({ status: AS.OFFERED, expiresAt: { $lt: now } })
    .select('incident volunteer')
    .lean();
  if (stale.length === 0) return 0;

  const ids = stale.map((a) => a._id);
  await Assignment.updateMany(
    { _id: { $in: ids }, status: AS.OFFERED },
    { $set: { status: AS.EXPIRED, respondedAt: now } }
  );

  await Promise.all(
    stale.map((a) =>
      notificationService.notify({
        user: a.volunteer,
        type: 'ASSIGNMENT_EXPIRED',
        title: 'অফারের সময় শেষ হয়ে গেছে',
        message: 'আপনি সময়মতো সাড়া দেননি, তাই emergency-টা অন্য কাউকে দেওয়া হয়েছে।',
        incident: a.incident,
        assignment: a._id,
      })
    )
  );

  const incidentIds = [...new Set(stale.map((a) => String(a.incident)))];
  for (const incidentId of incidentIds) {
    try {
      await afterOfferResolved(incidentId);
    } catch (err) {
      console.error('পরের matching round শুরু করা যায়নি:', err.message);
    }
  }

  return stale.length;
};

/* ------------------------------------------------------------------ */
/* পড়া (Reading)                                                       */
/* ------------------------------------------------------------------ */

const listMine = async (user, { status, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = { volunteer: user._id };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    populateForVolunteer(Assignment.find(filter))
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Assignment.countDocuments(filter),
  ]);

  return {
    items: items.map(shapeForVolunteer),
    pagination: buildPageInfo(total, pagination.page, pagination.limit),
  };
};

const listAll = async ({ status, incidentId, volunteerId, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = {};
  if (status) filter.status = status;
  if (incidentId) filter.incident = incidentId;
  if (volunteerId) filter.volunteer = volunteerId;

  const [items, total] = await Promise.all([
    Assignment.find(filter)
      .populate('volunteer', 'name phone')
      .populate('incident', 'trackingId type severity status priority location')
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Assignment.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

const getById = async (assignmentId, user) => {
  if (user.role === ROLES.ADMIN) {
    const assignment = await Assignment.findById(assignmentId)
      .populate('volunteer', 'name phone')
      .populate({ path: 'incident', populate: { path: 'reporter', select: 'name phone' } })
      .lean();
    if (!assignment) throw ApiError.notFound('Assignment পাওয়া যায়নি');
    return assignment;
  }

  const assignment = await populateForVolunteer(
    Assignment.findOne({ _id: assignmentId, volunteer: user._id })
  ).lean();
  if (!assignment) throw ApiError.notFound('Assignment পাওয়া যায়নি');
  return shapeForVolunteer(assignment);
};

module.exports = {
  dispatch,
  afterOfferResolved,
  manualAssign,
  accept,
  decline,
  updateProgress,
  withdraw,
  cancelAllForIncident,
  expireStaleOffers,
  listMine,
  listAll,
  getById,
};