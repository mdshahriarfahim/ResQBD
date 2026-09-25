/**
 * server.js
 * ---------
 * এন্ট্রি পয়েন্ট। `npm run dev` / `npm start` এই ফাইলটাই চালায়।
 * শুরু হওয়ার ক্রম:
 *   ১. config লোড হয় (.env)
 *   ২. MongoDB-এর সাথে connect হয়
 *   ৩. HTTP সার্ভার + Socket.io চালু হয়
 *   ৪. background job চালু হয়
 */
const http = require('http');
const config = require('./src/config/env'); // অবশ্যই প্রথমে হতে হবে: .env লোড করে
const { connectDB, disconnectDB } = require('./src/config/db');
const app = require('./src/app');
const { initSocket, closeSocket } = require('./src/socket');
const { startScheduler, stopScheduler } = require('./src/jobs/scheduler');

const start = async () => {
  await connectDB();

  // Socket.io-এর কাছে raw HTTP সার্ভার লাগে, তাই নিজেরাই বানাচ্ছি
  const server = http.createServer(app);
  initSocket(server);

  server.listen(config.port, () => {
    console.log(`ResQBD API চলছে ${config.nodeEnv} mode-এ, port ${config.port}-এ`);
    console.log(`Health check: http://localhost:${config.port}/api/health`);
    startScheduler();
  });

  // পোর্ট আগে থেকেই ব্যবহার হচ্ছে ইত্যাদি সমস্যা
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${config.port} ইতিমধ্যে ব্যবহার হচ্ছে। .env-এ PORT বদলান অথবা অন্য প্রোগ্রামটা বন্ধ করুন।`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  // Ctrl+C চাপলে বা hosting platform বন্ধ করতে বললে -> আগে চলমান request শেষ করে তারপর বন্ধ হয়
  const shutdown = (signal) => {
    console.log(`${signal} পাওয়া গেছে। বন্ধ হচ্ছে...`);
    stopScheduler();
    closeSocket();
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // কোনো promise fail করেছে কিন্তু কেউ ধরেনি -> লগ করে পরিষ্কারভাবে বন্ধ হওয়া
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
    shutdown('unhandledRejection');
  });
};

start();