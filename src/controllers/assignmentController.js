const assignmentService = require('../services/assignmentService');
const { sendSuccess } = require('../utils/apiResponse');

const listMine = async (req, res) => {
  const data = await assignmentService.listMine(req.user, req.validated.query);
  return sendSuccess(res, { message: 'আপনার assignment-গুলো লোড হয়েছে', data });
};

const listAll = async (req, res) => {
  const data = await assignmentService.listAll(req.validated.query);
  return sendSuccess(res, { message: 'Assignments লোড হয়েছে', data });
};

const getById = async (req, res) => {
  const assignment = await assignmentService.getById(req.params.id, req.user);
  return sendSuccess(res, { message: 'Assignment লোড হয়েছে', data: { assignment } });
};

const accept = async (req, res) => {
  const data = await assignmentService.accept(req.params.id, req.user);
  return sendSuccess(res, { message: 'Assignment accept করা হয়েছে', data });
};

const decline = async (req, res) => {
  const assignment = await assignmentService.decline(req.params.id, req.user, req.body.reason);
  return sendSuccess(res, { message: 'Assignment decline করা হয়েছে', data: { assignment } });
};

const updateProgress = async (req, res) => {
  const data = await assignmentService.updateProgress(req.params.id, req.user, req.body);
  return sendSuccess(res, { message: 'Progress আপডেট হয়েছে', data });
};

const withdraw = async (req, res) => {
  const assignment = await assignmentService.withdraw(req.params.id, req.user, req.body.reason);
  return sendSuccess(res, { message: 'আপনি এই assignment থেকে withdraw করেছেন', data: { assignment } });
};

const manualAssign = async (req, res) => {
  const data = await assignmentService.manualAssign(req.body, req.user);
  return sendSuccess(res, { statusCode: 201, message: 'Volunteer assign করা হয়েছে', data });
};

module.exports = { listMine, listAll, getById, accept, decline, updateProgress, withdraw, manualAssign };