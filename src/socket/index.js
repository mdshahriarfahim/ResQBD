/**
 * socket/index.js
 * ---------------
 * Socket.io দিয়ে real-time যোগাযোগ।
 *
 * Frontend যেভাবে connect করবে:
 *   const socket = io('http://localhost:5000', { auth: { token: '<JWT>' } });
 *
 * Connect হওয়ার পর প্রতিটা user-কে একটা "room"-এ রাখা হয়:
 *   user:<id>   - একজন user-এর নিজস্ব room (notification-এর জন্য)
 *   admins      - সব admin (live dashboard)
 *   volunteers  - সব volunteer
 *
 * সার্ভার যেসব event পাঠায়:
 *   notification:new   -> একজন user-কে
 *   incident:created   -> admin-দের
 *   incident:updated   -> admin + যে citizen রিপোর্ট করেছে তাকে
 *   assignment:updated -> admin + volunteer-কে
 *
 * Socket.io চালু না থাকলে (যেমন seed script চালানোর সময়), প্রতিটা emit
 * function চুপচাপ কিছুই করবে না, তাই service কখনো crash করবে না।
 */
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: config.clientUrls, methods: ['GET', 'POST'] },
  });

  // প্রতিটা connection-এর একটা বৈধ JWT থাকতে হবে
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication token missing'));

      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select('role isActive');
      if (!user || !user.isActive) return next(new Error('Account not available'));

      socket.data.userId = String(user._id);
      socket.data.role = user.role;
      return next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
    if (socket.data.role === ROLES.ADMIN) socket.join('admins');
    if (socket.data.role === ROLES.VOLUNTEER) socket.join('volunteers');

    socket.emit('connected', { userId: socket.data.userId, role: socket.data.role });
  });

  return io;
};

const closeSocket = () => {
  if (io) {
    io.close();
    io = null;
  }
};

const emitToUser = (userId, event, payload) => {
  if (io) io.to(`user:${String(userId)}`).emit(event, payload);
};

const emitToAdmins = (event, payload) => {
  if (io) io.to('admins').emit(event, payload);
};

// real-time মেসেজের জন্য একটা incident-এর ছোট, নিরাপদ সংস্করণ
const toIncidentSummary = (incident) => ({
  id: String(incident._id),
  trackingId: incident.trackingId,
  type: incident.type,
  severity: incident.severity,
  status: incident.status,
  priority: incident.priority ? { score: incident.priority.score, level: incident.priority.level } : null,
  location: incident.location ? { lat: incident.location.lat, lng: incident.location.lng } : null,
  updatedAt: incident.updatedAt,
});

const emitIncidentCreated = (incident) => {
  emitToAdmins('incident:created', toIncidentSummary(incident));
};

const emitIncidentUpdated = (incident) => {
  const summary = toIncidentSummary(incident);
  emitToAdmins('incident:updated', summary);
  if (incident.reporter) emitToUser(incident.reporter, 'incident:updated', summary);
};

const emitAssignmentUpdated = (assignment) => {
  const payload = {
    id: String(assignment._id),
    incident: String(assignment.incident),
    status: assignment.status,
  };
  emitToAdmins('assignment:updated', payload);
  emitToUser(assignment.volunteer, 'assignment:updated', payload);
};

module.exports = {
  initSocket,
  closeSocket,
  emitToUser,
  emitToAdmins,
  emitIncidentCreated,
  emitIncidentUpdated,
  emitAssignmentUpdated,
};