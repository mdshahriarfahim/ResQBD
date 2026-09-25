/**
 * services/priorityService.js
 * ---------------------------
 * EXPLAINABLE priority scoring (কোনো AI/machine learning নেই)।
 *
 *   score = type পয়েন্ট + severity পয়েন্ট + অপেক্ষার সময়ের পয়েন্ট + density পয়েন্ট   (0-100)
 *
 * প্রতিটা অংশ `breakdown`-এ, সাথে সহজ ভাষায় কারণ সহ রিটার্ন হয়, যাতে
 * যেকেউ দেখতে পারে কেন একটা incident CRITICAL/HIGH/MEDIUM/LOW হলো।
 * সব নাম্বার আসে config/priority.config.js থেকে।
 *
 * computePriority() একটা PURE function (কোনো database নেই), তাই সহজে
 * টেস্ট করা যায়।
 */
const cfg = require('../config/priority.config');
const Incident = require('../models/Incident');
const densityService = require('./densityService');
const notificationService = require('./notificationService');
const realtime = require('../socket');
const { OPEN_STATUSES } = require('../config/constants');

const round1 = (n) => Math.round(n * 10) / 10;

const levelForScore = (score) => {
  const rule = cfg.levels.find((l) => score >= l.minScore);
  return rule ? rule.level : 'LOW';
};

const densityPointsFor = (density) => {
  if (density === null || density === undefined) return cfg.populationDensity.unknownPoints;
  const band = cfg.populationDensity.bands.find((b) => density >= b.minDensity);
  return band ? band.points : 0;
};

const label = (text) => String(text).replace(/_/g, ' ').toLowerCase();

/**
 * @param {object} input { type, severity, createdAt, populationDensity, densityMatchedOn }
 * @param {Date}   now
 */
const computePriority = (input, now = new Date()) => {
  const { type, severity, createdAt, populationDensity = null, densityMatchedOn = null } = input;

  // ১. Incident type
  const typePoints = cfg.incidentType.points[type] ?? cfg.incidentType.points.OTHER;

  // ২. Severity
  const severityPoints = cfg.severity.points[severity] ?? 0;

  // ৩. অপেক্ষার সময়
  const elapsedMinutes = Math.max(0, (now.getTime() - new Date(createdAt).getTime()) / 60000);
  const timePoints = round1(
    Math.min(cfg.elapsedTime.max, elapsedMinutes * cfg.elapsedTime.pointsPerMinute)
  );

  // ৪. জনঘনত্ব
  const densityPoints = densityPointsFor(populationDensity);

  const score = round1(typePoints + severityPoints + timePoints + densityPoints);
  const level = levelForScore(score);

  const breakdown = {
    incidentType: {
      input: type,
      points: typePoints,
      maxPoints: cfg.incidentType.max,
      reason: `${label(type)} ধরনের incident-এর base weight ${cfg.incidentType.max}-এর মধ্যে ${typePoints}`,
    },
    severity: {
      input: severity,
      points: severityPoints,
      maxPoints: cfg.severity.max,
      reason: `Severity ${severity} দিলে ${cfg.severity.max}-এর মধ্যে ${severityPoints} পয়েন্ট`,
    },
    elapsedTime: {
      input: { elapsedMinutes: round1(elapsedMinutes) },
      points: timePoints,
      maxPoints: cfg.elapsedTime.max,
      reason: `${round1(elapsedMinutes)} মিনিট অপেক্ষা x ${cfg.elapsedTime.pointsPerMinute} পয়েন্ট/মিনিট = ${timePoints} (সর্বোচ্চ ${cfg.elapsedTime.max})`,
    },
    populationDensity: {
      input:
        populationDensity === null || populationDensity === undefined
          ? null
          : { peoplePerSqKm: populationDensity, matchedOn: densityMatchedOn },
      points: densityPoints,
      maxPoints: cfg.populationDensity.max,
      reason:
        populationDensity === null || populationDensity === undefined
          ? 'এই এলাকার জনঘনত্বের ডেটা নেই, তাই ০ পয়েন্ট দেওয়া হয়েছে'
          : `প্রায় ${Math.round(populationDensity)} জন/বর্গ কিমি (${densityMatchedOn} লেভেল) দিলে ${cfg.populationDensity.max}-এর মধ্যে ${densityPoints} পয়েন্ট`,
    },
  };

  const explanation =
    `${level} (${score}/100): ${label(type)} ${typePoints}/${cfg.incidentType.max}` +
    ` + severity ${severity} ${severityPoints}/${cfg.severity.max}` +
    ` + অপেক্ষার সময় ${timePoints}/${cfg.elapsedTime.max}` +
    ` + জনঘনত্ব ${densityPoints}/${cfg.populationDensity.max}`;

  return {
    score,
    level,
    breakdown,
    explanation,
    formulaVersion: cfg.version,
    calculatedAt: now,
  };
};

/**
 * জনঘনত্ব খুঁজে বের করে, তারপর একটা incident-এর priority হিসেব করে।
 */
const calculateForIncident = async (incident, now = new Date(), densityCache = null) => {
  const { district, upazila } = incident.location || {};
  const cacheKey = `${district || ''}|${upazila || ''}`;

  let density;
  if (densityCache && densityCache.has(cacheKey)) {
    density = densityCache.get(cacheKey);
  } else {
    density = await densityService.getDensity(district, upazila);
    if (densityCache) densityCache.set(cacheKey, density);
  }

  return computePriority(
    {
      type: incident.type,
      severity: incident.severity,
      createdAt: incident.createdAt,
      populationDensity: density.populationDensity,
      densityMatchedOn: density.matchedOn,
    },
    now
  );
};

/**
 * সময়ের সাথে সাথে elapsed-time অংশ বাড়তে থাকে। background job এটা কল
 * করে সব open incident-এর score নতুন করে হিসেব করার জন্য। level বদলে
 * গেলে (যেমন HIGH -> CRITICAL) admin-কে জানানো হয়।
 */
const recalculateOpenIncidents = async (now = new Date()) => {
  const incidents = await Incident.find({ status: { $in: OPEN_STATUSES } }).limit(500);
  const densityCache = new Map();
  let updatedCount = 0;

  for (const incident of incidents) {
    const fresh = await calculateForIncident(incident, now, densityCache);
    const old = incident.priority || {};

    if (old.score === undefined || Math.abs(old.score - fresh.score) >= 0.1) {
      const updated = await Incident.findByIdAndUpdate(
        incident._id,
        { $set: { priority: fresh } },
        // timestamps:false -> score refresh টাকে "status change" মনে করবে না
        { returnDocument: 'after', timestamps: false }
      );
      updatedCount += 1;

      if (updated) {
        realtime.emitIncidentUpdated(updated);

        if (old.level && old.level !== fresh.level) {
          await notificationService.notifyAdmins({
            type: 'PRIORITY_CHANGED',
            title: `Priority বদলে ${fresh.level} হয়েছে`,
            message: `${incident.trackingId}-এর priority ${old.level} থেকে ${fresh.level}-এ গেছে। ${fresh.explanation}`,
            incident: incident._id,
          });
        }
      }
    }
  }

  return updatedCount;
};

module.exports = {
  computePriority,
  calculateForIncident,
  recalculateOpenIncidents,
  levelForScore,
  config: cfg,
};