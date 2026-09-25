/**
 * config/matching.config.js
 * -------------------------
 * Volunteer matching algorithm এর সব নাম্বার এখানে।
 *
 * Match score (0 - 100) =
 *     distance পয়েন্ট   (max 50)  কাছে হলে বেশি পয়েন্ট
 *   + skill পয়েন্ট       (max 30)  volunteer-এর skill incident type-এর সাথে মিললে
 *   + workload পয়েন্ট    (max 20)  কম কাজ থাকলে বেশি পয়েন্ট
 */
module.exports = {
  version: '1.0',

  // প্রথমে ছোট radius-এ খোঁজা হবে। কেউ না পেলে radius বাড়বে।
  // (গ্রাম এলাকায় volunteer কম থাকে, তাই ৩০ কিমি পর্যন্ত যেতে পারে)
  searchRadiiKm: [10, 20, 30],

  // একসাথে কতজন volunteer-কে অফার পাঠানো হবে। যে আগে accept করবে সে পাবে।
  maxOffersPerRound: 3,

  // volunteer এই সময়ের মধ্যে উত্তর না দিলে অফার expire হয়ে যাবে
  offerExpiryMinutes: 5,

  // এতগুলো round চেষ্টা করার পরও কেউ accept না করলে, incident admin-এর কাছে চলে যাবে
  maxMatchingRounds: 3,

  // volunteer-এর সেভ করা location এর চেয়ে পুরোনো হলে সেটা অবিশ্বস্ত ধরা হবে
  locationMaxAgeMinutes: 24 * 60,

  // true হলে শুধু matching skill থাকা volunteer-দেরই বিবেচনা করা হবে।
  // false হলে skill শুধু বাড়তি পয়েন্ট দেয় (volunteer কম থাকলে এটাই ভালো)।
  requireSkillMatch: false,

  weights: {
    distance: 50,
    skill: 30,
    workload: 20,
  },

  // যে volunteer শুধু GENERAL skill রাখে, সে এই পয়েন্ট পাবে
  generalSkillPoints: 10,

  // কোন incident type-এর জন্য কোন skill কাজে লাগবে
  typeToSkills: {
    FIRE: ['FIREFIGHTING', 'RESCUE', 'FIRST_AID'],
    FLOOD: ['BOAT_OPERATION', 'RESCUE', 'DISASTER_RELIEF'],
    ROAD_ACCIDENT: ['FIRST_AID', 'MEDICAL', 'DRIVING', 'RESCUE'],
    MEDICAL: ['MEDICAL', 'FIRST_AID'],
    CYCLONE: ['DISASTER_RELIEF', 'RESCUE', 'BOAT_OPERATION'],
    BUILDING_COLLAPSE: ['RESCUE', 'FIRST_AID', 'MEDICAL'],
    OTHER: ['GENERAL'],
  },
};