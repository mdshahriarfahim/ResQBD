/**
 * controllers/healthController.js
 * --------------------------------
 * সার্ভার চলছে কিনা চেক করার জন্য একটা সহজ endpoint।
 */
const health = (req, res) => {
  res.status(200).json({ success: true, message: 'ResQBD API is running' });
};

module.exports = { health };