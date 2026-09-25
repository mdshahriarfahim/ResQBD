/**
 * jobs/scheduler.js
 * -----------------
 * একটা ছোট background job যেটা প্রতি কয়েক সেকেন্ড পরপর (SCHEDULER_INTERVAL_SECONDS)
 * চলে:
 *   ১. যে অফারগুলোর সময়মতো উত্তর আসেনি -> EXPIRED, পরের matching round শুরু হয়
 *   ২. matching fail হওয়ার কারণে আটকে থাকা incident -> matching আবার চেষ্টা হয়
 *   ৩. open incident-গুলোর priority score নতুন করে হিসেব হয় (অপেক্ষার সময় বাড়ছে)
 *
 * ইচ্ছাকৃতভাবে সহজ setInterval ব্যবহার করা হয়েছে: বাড়তি কোনো লাইব্রেরি
 * লাগেনি, বোঝানো সহজ। (অনেকগুলো সার্ভার চালালে একটা আসল job queue
 * লাগতো, কিন্তু একটা সার্ভারের জন্য এটাই যথেষ্ট।)
 */
const config = require('../config/env');
const assignmentService = require('../services/assignmentService');
const incidentService = require('../services/incidentService');
const priorityService = require('../services/priorityService');

let timer = null;
let running = false;

const safely = async (name, job) => {
  try {
    return await job();
  } catch (err) {
    console.error(`Scheduler job "${name}" ব্যর্থ হয়েছে:`, err.message);
    return null;
  }
};

/** সব job একবার চালায়। test-এর জন্য আলাদাভাবে export করা আছে। */
const runOnce = async () => {
  if (running) return; // দুইটা run একসাথে চলতে দেওয়া হয় না
  running = true;
  try {
    await safely('offer expire করা', () => assignmentService.expireStaleOffers());
    await safely('matching আবার চেষ্টা করা', () => incidentService.retryUndispatched());
    await safely('priority নতুন করে হিসেব করা', () => priorityService.recalculateOpenIncidents());
  } finally {
    running = false;
  }
};

const startScheduler = () => {
  if (timer) return;
  timer = setInterval(runOnce, config.schedulerIntervalSeconds * 1000);
  timer.unref();
  console.log(`Background jobs শুরু হয়েছে (প্রতি ${config.schedulerIntervalSeconds} সেকেন্ডে)`);
};

const stopScheduler = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

module.exports = { startScheduler, stopScheduler, runOnce };