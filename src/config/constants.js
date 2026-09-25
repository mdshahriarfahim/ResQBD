/**
 * config/constants.js
 * -------------------
 * সিস্টেমের সব fixed list এবং নিয়ম এক জায়গায়।
 * (Roles, incident types, status, allowed status changes, ...)
 * Models, validators, services — সবাই এখান থেকেই ভ্যালু নেয়, যাতে
 * একই জিনিস দুই জায়গায় হাতে টাইপ করতে না হয়।
 */

const ROLES = Object.freeze({
  CITIZEN: 'CITIZEN',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN',
});

const INCIDENT_TYPES = Object.freeze([
  'FIRE',
  'FLOOD',
  'ROAD_ACCIDENT',
  'MEDICAL',
  'CYCLONE',
  'BUILDING_COLLAPSE',
  'OTHER',
]);

const SEVERITIES = Object.freeze(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

// PRIORITY_LEVEL এর নাম SEVERITY এর মতোই, কিন্তু এটা citizen টাইপ করে না —
// priority algorithm হিসেব করে বের করে।
const PRIORITY_LEVELS = Object.freeze(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

const INCIDENT_STATUS = Object.freeze({
  REPORTED: 'REPORTED', //     citizen এইমাত্র রিপোর্ট করেছে
  PRIORITIZED: 'PRIORITIZED', // priority score হিসেব হয়ে গেছে
  MATCHING: 'MATCHING', //     সিস্টেম volunteer খুঁজছে
  ASSIGNED: 'ASSIGNED', //     অফার পাঠানো হয়েছে, volunteer-এর উত্তরের অপেক্ষা
  ACCEPTED: 'ACCEPTED', //     একজন volunteer accept করেছে
  EN_ROUTE: 'EN_ROUTE', //     volunteer যাচ্ছে
  ON_SCENE: 'ON_SCENE', //     volunteer জায়গায় পৌঁছেছে
  RESOLVED: 'RESOLVED', //     volunteer কাজ শেষ করেছে
  CLOSED: 'CLOSED', //         admin verify করে বন্ধ করে দিয়েছে
  CANCELLED: 'CANCELLED', //   বাতিল হয়েছে (fake report / আর দরকার নেই)
  ESCALATED: 'ESCALATED', //   সিস্টেম volunteer খুঁজে পায়নি, admin-কে হাতে ধরতে হবে
});

/**
 * কোন status থেকে কোন status-এ যাওয়া যাবে (একটা ছোট state machine)।
 * যেমন: REPORTED থেকে সরাসরি RESOLVED-এ লাফ দেওয়া যাবে না।
 */
const STATUS_TRANSITIONS = Object.freeze({
  REPORTED: ['PRIORITIZED', 'CANCELLED'],
  PRIORITIZED: ['MATCHING', 'ASSIGNED', 'ESCALATED', 'CANCELLED'],
  MATCHING: ['ASSIGNED', 'ESCALATED', 'CANCELLED'],
  ASSIGNED: ['ACCEPTED', 'MATCHING', 'ESCALATED', 'CANCELLED'],
  ESCALATED: ['MATCHING', 'ASSIGNED', 'CANCELLED'],
  ACCEPTED: ['EN_ROUTE', 'ESCALATED', 'CANCELLED'],
  EN_ROUTE: ['ON_SCENE', 'ESCALATED', 'CANCELLED'],
  ON_SCENE: ['RESOLVED', 'ESCALATED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
});

// কোন incident-গুলোর priority এখনো সময়ের সাথে পুনরায় হিসেব করা দরকার
const OPEN_STATUSES = Object.freeze([
  'REPORTED',
  'PRIORITIZED',
  'MATCHING',
  'ASSIGNED',
  'ESCALATED',
  'ACCEPTED',
  'EN_ROUTE',
  'ON_SCENE',
]);

// volunteer একবার scene-এ পৌঁছে গেলে citizen আর cancel করতে পারবে না
const FINISHED_STATUSES = Object.freeze(['RESOLVED', 'CLOSED', 'CANCELLED']);

const ASSIGNMENT_STATUS = Object.freeze({
  OFFERED: 'OFFERED', //     volunteer-কে পাঠানো হয়েছে, উত্তরের অপেক্ষা
  ACCEPTED: 'ACCEPTED',
  EN_ROUTE: 'EN_ROUTE',
  ON_SCENE: 'ON_SCENE',
  COMPLETED: 'COMPLETED',
  DECLINED: 'DECLINED', //   volunteer না বলেছে
  EXPIRED: 'EXPIRED', //     সময়মতো উত্তর দেয়নি
  CANCELLED: 'CANCELLED', // incident cancel হয়েছে, বা অন্য কেউ আগে accept করেছে
  WITHDRAWN: 'WITHDRAWN', // volunteer accept করার পর মাঝপথে সরে গেছে
});

// এই status-গুলোতে থাকা মানেই volunteer এখন "ব্যস্ত"
const ACTIVE_ASSIGNMENT_STATUSES = Object.freeze(['ACCEPTED', 'EN_ROUTE', 'ON_SCENE']);

const VOLUNTEER_SKILLS = Object.freeze([
  'GENERAL',
  'FIRST_AID',
  'MEDICAL',
  'FIREFIGHTING',
  'RESCUE',
  'BOAT_OPERATION',
  'DRIVING',
  'DISASTER_RELIEF',
]);

const NOTIFICATION_TYPES = Object.freeze([
  'INCIDENT_CREATED',
  'INCIDENT_STATUS_CHANGED',
  'INCIDENT_ESCALATED',
  'PRIORITY_CHANGED',
  'ASSIGNMENT_OFFERED',
  'ASSIGNMENT_ACCEPTED',
  'ASSIGNMENT_CANCELLED',
  'ASSIGNMENT_EXPIRED',
  'VOLUNTEER_WITHDRAWN',
]);

// বাংলাদেশের মোটামুটি bounding box (একটু margin সহ)।
// কোনো লোকেশন স্পষ্টভাবে বাংলাদেশের বাইরে হলে reject করার জন্য ব্যবহার হয়।
const BANGLADESH_BOUNDS = Object.freeze({
  minLat: 20.5,
  maxLat: 26.7,
  minLng: 88.0,
  maxLng: 92.8,
});

module.exports = {
  ROLES,
  INCIDENT_TYPES,
  SEVERITIES,
  PRIORITY_LEVELS,
  INCIDENT_STATUS,
  STATUS_TRANSITIONS,
  OPEN_STATUSES,
  FINISHED_STATUSES,
  ASSIGNMENT_STATUS,
  ACTIVE_ASSIGNMENT_STATUSES,
  VOLUNTEER_SKILLS,
  NOTIFICATION_TYPES,
  BANGLADESH_BOUNDS,
};