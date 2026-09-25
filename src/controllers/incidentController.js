const incidentService = require('../services/incidentService');
const { sendSuccess } = require('../utils/apiResponse');

const create = async (req, res) => {
  const incident = await incidentService.createIncident(req.user, req.body, req.file);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Incident সফলভাবে রিপোর্ট করা হয়েছে',
    data: { incident },
  });
};

const listMine = async (req, res) => {
  const data = await incidentService.listMine(req.user, req.validated.query);
  return sendSuccess(res, { message: 'আপনার incident-গুলো লোড হয়েছে', data });
};

const listAll = async (req, res) => {
  const data = await incidentService.listAll(req.validated.query);
  return sendSuccess(res, { message: 'Incidents লোড হয়েছে', data });
};

const getDetails = async (req, res) => {
  const data = await incidentService.getDetails(req.params.id, req.user);
  return sendSuccess(res, { message: 'Incident লোড হয়েছে', data });
};

const cancel = async (req, res) => {
  const incident = await incidentService.cancel(req.params.id, req.user, req.body.reason);
  return sendSuccess(res, { message: 'Incident cancel করা হয়েছে', data: { incident } });
};

const close = async (req, res) => {
  const incident = await incidentService.close(req.params.id, req.user, req.body.note);
  return sendSuccess(res, { message: 'Incident close করা হয়েছে', data: { incident } });
};

const rematch = async (req, res) => {
  const result = await incidentService.rematch(req.params.id, req.user);
  return sendSuccess(res, {
    message:
      result.offered > 0
        ? `${result.offered} জন volunteer-কে অফার পাঠানো হয়েছে`
        : 'এখন কোনো উপযুক্ত volunteer available নেই। Incident-টা এখনো escalated অবস্থায় আছে',
    data: { incident: result.incident, offered: result.offered },
  });
};

module.exports = { create, listMine, listAll, getDetails, cancel, close, rematch };