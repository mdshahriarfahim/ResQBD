/**
 * utils/haversine.js
 * ------------------
 * পৃথিবীর দুইটা বিন্দুর (latitude/longitude) মধ্যে দূরত্ব বের করে।
 *
 * Haversine formula পৃথিবীকে একটা গোলক (sphere) ধরে হিসেব করে:
 *   a = sin²(dLat/2) + cos(lat1) · cos(lat2) · sin²(dLng/2)
 *   distance = 2 · R · asin(√a)
 *
 * R (পৃথিবীর ব্যাসার্ধ) = 6371.0088 কিমি
 */
const EARTH_RADIUS_KM = 6371.0088;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * @returns {number} দূরত্ব কিলোমিটারে
 */
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
};

/**
 * radius এর circle-কে অবশ্যই ধরে ফেলবে এমন একটা চতুর্ভুজ (square)।
 * matching-এ আমরা এটা FAST প্রথম ফিল্টার হিসেবে database-এ ব্যবহার করি
 * ("শুধু এই square-এর ভেতরের volunteer-রা"), তারপর অল্প কয়েকজনের উপর
 * সঠিক Haversine formula চালাই।
 * ১ ডিগ্রি latitude মানে সবখানেই প্রায় ১১১.৩২ কিমি।
 */
const boundingBox = (lat, lng, radiusKm) => {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.max(Math.cos(toRadians(lat)), 0.01));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
};

module.exports = { haversineKm, boundingBox, EARTH_RADIUS_KM };