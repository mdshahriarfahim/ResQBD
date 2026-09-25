/**
 * config/env.js
 * -------------
 * এইটাই একমাত্র জায়গা যেখানে আমরা process.env পড়ব।
 * বাকি সব ফাইল এখান থেকে ভ্যালু নিবে:
 *
 *   const config = require('../config/env');
 *   config.port
 *
 * কেন এভাবে? যাতে secret/settings কখনো হার্ডকোড না হয়, আর কোনো জরুরি
 * জিনিস মিসিং থাকলে সার্ভার সাথে সাথে বন্ধ হয়ে স্পষ্ট মেসেজ দেখায়।
 */
const path = require('path');
const dotenv = require('dotenv');

// backend/.env লোড করা হচ্ছে (path explicit রাখা হয়েছে, যাতে যেকোনো ফোল্ডার থেকে চালালেও কাজ করে)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// এই ভ্যারিয়েবলগুলো অবশ্যই থাকতে হবে, নাহলে সার্ভার শুরু হবে না
const REQUIRED_VARS = ['PORT', 'CLIENT_URL', 'MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

const toPositiveInt = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    console.error(`${name} must be a positive whole number. Received: "${raw}"`);
    process.exit(1);
  }
  return value;
};

const port = toPositiveInt('PORT', 5000);

if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET is too short. Use at least 32 characters (a long random string).');
  process.exit(1);
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,

  // কোন কোন frontend URL থেকে এই API কল করা যাবে (কমা দিয়ে একাধিক লিখা যায়)
  clientUrls: process.env.CLIENT_URL.split(',')
    .map((url) => url.trim())
    .filter(Boolean),

  mongodbUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  // পাসওয়ার্ড hash করা কতটা "ধীর" হবে। বেশি = নিরাপদ কিন্তু লগইন একটু স্লো হয়
  bcryptRounds: toPositiveInt('BCRYPT_ROUNDS', 10),

  // incident-এর ছবি কোথায় সেভ হবে
  uploadDir: path.resolve(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads'),
  maxUploadMb: toPositiveInt('MAX_UPLOAD_MB', 5),

  // background job (offer expiry, priority recalculation) কত সেকেন্ড পরপর চলবে
  schedulerIntervalSeconds: toPositiveInt('SCHEDULER_INTERVAL_SECONDS', 30),

  // শুধু automated test-এর জন্য RATE_LIMIT_ENABLED=false সেট করা হয়
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
};

config.isProduction = config.nodeEnv === 'production';

module.exports = config;