/**
 * middleware/upload.js
 * --------------------
 * incident-এর ঐচ্ছিক ছবি হ্যান্ডেল করে (multipart/form-data, field name "image")।
 *
 * সিকিউরিটি নিয়ম:
 *  - শুধু JPEG, PNG, WEBP
 *  - সর্বোচ্চ সাইজ .env থেকে (MAX_UPLOAD_MB)
 *  - ফাইলের নাম random করে দেওয়া হয়; ইউজারের দেওয়া নাম কখনো ব্যবহার হয় না
 *  - আসল ফাইলের content চেক করা হয় (magic bytes), শুধু browser-এর দেওয়া
 *    label বিশ্বাস করা হয় না
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

const INCIDENT_DIR = path.join(config.uploadDir, 'incidents');
fs.mkdirSync(INCIDENT_DIR, { recursive: true });

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, INCIDENT_DIR),
  filename: (req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype];
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (MIME_TO_EXT[file.mimetype]) return cb(null, true);
  return cb(ApiError.badRequest('শুধু JPEG, PNG বা WEBP ছবি দেওয়া যাবে'));
};

const uploadIncidentImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
}).single('image');

// আসল image ফাইলের প্রথম কয়েক বাইট
const startsWith = (buffer, bytes) => bytes.every((byte, i) => buffer[i] === byte);

const looksLikeImage = (buffer) =>
  startsWith(buffer, [0xff, 0xd8, 0xff]) || // JPEG
  startsWith(buffer, [0x89, 0x50, 0x4e, 0x47]) || // PNG
  (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && buffer.slice(8, 12).toString() === 'WEBP'); // WEBP

/**
 * multer-এর পরে চলে। content আসলেই ছবি না হলে ফাইল ডিলিট করে দেয় এবং
 * request reject করে।
 */
const verifyImageContent = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const handle = await fs.promises.open(req.file.path, 'r');
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, 12, 0);
    await handle.close();

    if (!looksLikeImage(buffer)) {
      await fs.promises.unlink(req.file.path);
      return next(ApiError.badRequest('আপলোড করা ফাইলটা বৈধ ছবি না'));
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { uploadIncidentImage, verifyImageContent };