/**
 * app.js
 * ------
 * Express অ্যাপ্লিকেশন বানায় এবং configure করে।
 * এটা সার্ভার START করে না (সেটা server.js-এর কাজ)। এই দুটো আলাদা
 * রাখার সুবিধা — অ্যাপটা টেস্ট করা সহজ হয়।
 *
 * Express-এ ORDER (ক্রম) গুরুত্বপূর্ণ। Middleware উপর থেকে নিচে চলে:
 *   security -> logging -> body parsing -> sanitizing -> routes -> 404 -> error handler
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const sanitizeInput = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimiters');

const app = express();

// ১. সিকিউরিটি হেডার
app.use(helmet());

// ২. CORS: শুধু .env-এ দেওয়া frontend URL(গুলো) থেকে API কল করা যাবে
app.use(
  cors({
    origin: config.clientUrls,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ৩. Request লগ (automated test চলার সময় চুপচাপ থাকে)
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// ৪. আপলোড করা incident-এর ছবি। random ফাইলের নাম; directory listing বন্ধ।
app.use(
  '/uploads',
  (req, res, next) => {
    // Helmet ডিফল্টভাবে cross-origin ছবি লোড হওয়া আটকায়। React frontend
    // আলাদা পোর্টে চলে, তাই সেখান থেকে ছবি লোড হওয়ার অনুমতি দিতে হবে।
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(config.uploadDir, { index: false, dotfiles: 'deny' })
);

// ৫. JSON body parse করা (limit দিয়ে অনেক বড় payload আটকানো হয়)
app.use(express.json({ limit: '10kb' }));

// ৬. NoSQL-injection ধরনের input reject করা
app.use(sanitizeInput);

// ৭. একজন client কতগুলো request পাঠাতে পারবে তা সীমিত করা
app.use('/api', apiLimiter);

// ৮. সব API route থাকে /api-এর নিচে
app.use('/api', routes);

// ৯. যেটা কোনো route-এর সাথে মেলেনি -> 404
app.use(notFound);

// ১০. সব error শেষমেশ এখানে আসে (অবশ্যই সবার শেষে থাকতে হবে)
app.use(errorHandler);

module.exports = app;