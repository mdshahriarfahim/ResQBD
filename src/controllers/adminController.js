const adminService = require('../services/adminService');
const densityService = require('../services/densityService');
const { sendSuccess } = require('../utils/apiResponse');

const dashboard = async (req, res) => {
  const data = await adminService.getDashboard();
  return sendSuccess(res, { message: 'Dashboard লোড হয়েছে', data });
};

const mapIncidents = async (req, res) => {
  const data = await adminService.getMapIncidents();
  return sendSuccess(res, { message: 'Map incidents লোড হয়েছে', data });
};

const mapVolunteers = async (req, res) => {
  const data = await adminService.getMapVolunteers();
  return sendSuccess(res, { message: 'Map volunteers লোড হয়েছে', data });
};

const scoringConfig = (req, res) =>
  sendSuccess(res, { message: 'Scoring configuration লোড হয়েছে', data: adminService.getScoringConfig() });

const listDensity = async (req, res) => {
  const data = await densityService.listDensities(req.validated.query);
  return sendSuccess(res, { message: 'Area densities লোড হয়েছে', data });
};

const upsertDensity = async (req, res) => {
  const density = await densityService.upsertDensity(req.body);
  return sendSuccess(res, { message: 'Area density সেভ হয়েছে', data: { density } });
};

module.exports = { dashboard, mapIncidents, mapVolunteers, scoringConfig, listDensity, upsertDensity };