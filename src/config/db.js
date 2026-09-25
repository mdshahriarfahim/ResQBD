/**
 * config/db.js
 * ------------
 * Mongoose দিয়ে MongoDB-এর সাথে connect করে।
 */
const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Is MongoDB running? Check MONGODB_URI in your .env file.');
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, disconnectDB };
