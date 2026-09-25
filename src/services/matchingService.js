/**
 * services/matchingService.js
 * ---------------------------
 * একটা incident-এর জন্য উপযুক্ত volunteer খুঁজে ranking করে। Rule-based,
 * explainable — কোনো ব্ল্যাকবক্স AI না।
 *
 * ধাপগুলো:
 *  ১. শুধু verified, available, active, এবং সাম্প্রতিক location আছে
 *     এমন volunteer-দের নেওয়া হয়।
 *  ২. Database-এ FAST ফিল্টার: incident-এর চারপাশে একটা "bounding box"।
 *  ৩. সঠিক দূরত্ব বের করতে Haversine formula; শুধু search circle-এর
 *     ভেতরের ভলান্টিয়ারদের রাখা হয়।
 *  ৪. যাদের maximum workload হয়ে গেছে তাদের বাদ দেওয়া হয়।
 *  ৫. প্রতিটা volunteer-কে score দেওয়া হয় (distance + skill + workload),
 *     এরপর sort করা হয়।
 *  ৬. Search radius বাড়তে থাকে (১০ -> ২০ -> ৩০ কিমি) যতক্ষণ না অন্তত
 *     একজন volunteer পাওয়া যায়।
 *
 * প্রতিটা candidate-এর সাথে একটা `breakdown` থাকে যেটা score ব্যাখ্যা করে।
 */
const cfg = require('../config/matching.config');
const VolunteerProfile = require('../models/VolunteerProfile');
const { haversineKm, boundingBox } = require('../utils/haversine');

const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;

/**
 * PURE function: একজন volunteer-কে score দেয়। কোনো database নেই।
 */
const scoreCandidate = ({ distanceKm, maxRadiusKm, skills, incidentType, activeCount, maxActive }) => {
  // Distance: দূরত্ব ০ হলে ৫০ পয়েন্ট, সবচেয়ে বড় search radius-এ ০ পয়েন্ট
  const distanceRatio = Math.max(0, 1 - distanceKm / maxRadiusKm);
  const distancePoints = round1(cfg.weights.distance * distanceRatio);

  // Skill: কাজের skill থাকলে পুরো পয়েন্ট, শুধু GENERAL থাকলে ছোট পয়েন্ট
  const wanted = cfg.typeToSkills[incidentType] || ['GENERAL'];
  const matchedSkills = skills.filter((skill) => wanted.includes(skill));
  let skillPoints = 0;
  let skillReason;
  if (matchedSkills.length > 0) {
    skillPoints = cfg.weights.skill;
    skillReason = `${incidentType}-এর জন্য কাজের skill আছে: ${matchedSkills.join(', ')}`;
  } else if (skills.includes('GENERAL')) {
    skillPoints = cfg.generalSkillPoints;
    skillReason = 'এই incident type-এর জন্য নির্দিষ্ট skill নেই, general volunteer';
  } else {
    skillReason = 'কোনো মিলে যাওয়া skill নেই';
  }

  // Workload: যার active incident কম, সে বেশি পয়েন্ট পায়
  const workloadPoints = round1(cfg.weights.workload * (1 - activeCount / maxActive));

  const total = round1(distancePoints + skillPoints + workloadPoints);

  return {
    total,
    breakdown: {
      distance: {
        km: round2(distanceKm),
        points: distancePoints,
        maxPoints: cfg.weights.distance,
        reason: `${round2(distanceKm)} কিমি দূরে (search area সর্বোচ্চ ${maxRadiusKm} কিমি পর্যন্ত)`,
      },
      skill: {
        matched: matchedSkills,
        points: skillPoints,
        maxPoints: cfg.weights.skill,
        reason: skillReason,
      },
      workload: {
        activeAssignments: activeCount,
        maxAssignments: maxActive,
        points: workloadPoints,
        maxPoints: cfg.weights.workload,
        reason: `এখন ${maxActive}-এর মধ্যে ${activeCount}টা incident সামলাচ্ছে`,
      },
    },
  };
};

/**
 * @param {object} incident     incident (location + type লাগবে)
 * @param {object} options      { excludeUserIds: [] } যাদের আবার অফার দেওয়া যাবে না
 * @returns {{ radiusKm, candidates: Array }} সবচেয়ে ভালো candidate আগে
 */
const findCandidates = async (incident, { excludeUserIds = [], now = new Date() } = {}) => {
  const { lat, lng } = incident.location;
  const maxRadiusKm = cfg.searchRadiiKm[cfg.searchRadiiKm.length - 1];
  const oldestAllowedLocation = new Date(now.getTime() - cfg.locationMaxAgeMinutes * 60000);
  const wantedSkills = cfg.typeToSkills[incident.type] || ['GENERAL'];

  for (const radiusKm of cfg.searchRadiiKm) {
    const box = boundingBox(lat, lng, radiusKm);

    const profiles = await VolunteerProfile.find({
      isAvailable: true,
      isVerified: true,
      user: { $nin: excludeUserIds },
      'currentLocation.lat': { $gte: box.minLat, $lte: box.maxLat },
      'currentLocation.lng': { $gte: box.minLng, $lte: box.maxLng },
      'currentLocation.updatedAt': { $gte: oldestAllowedLocation },
    }).populate('user', 'name phone isActive');

    const candidates = [];

    for (const profile of profiles) {
      if (!profile.user || !profile.user.isActive) continue;
      if (profile.activeAssignmentCount >= profile.maxActiveAssignments) continue;

      if (cfg.requireSkillMatch && !profile.skills.some((s) => wantedSkills.includes(s))) continue;

      const distanceKm = haversineKm(lat, lng, profile.currentLocation.lat, profile.currentLocation.lng);
      if (distanceKm > radiusKm) continue; // square-এর ভেতরে কিন্তু circle-এর বাইরে

      const { total, breakdown } = scoreCandidate({
        distanceKm,
        maxRadiusKm,
        skills: profile.skills,
        incidentType: incident.type,
        activeCount: profile.activeAssignmentCount,
        maxActive: profile.maxActiveAssignments,
      });

      candidates.push({
        user: profile.user._id,
        name: profile.user.name,
        distanceKm: round2(distanceKm),
        matchScore: total,
        breakdown: {
          ...breakdown,
          searchRadiusKm: radiusKm,
          formulaVersion: cfg.version,
          summary: `Match ${total}/100: distance ${breakdown.distance.points}/${cfg.weights.distance} + skill ${breakdown.skill.points}/${cfg.weights.skill} + workload ${breakdown.workload.points}/${cfg.weights.workload}`,
        },
      });
    }

    if (candidates.length > 0) {
      // সবচেয়ে ভালো score আগে; সমান হলে কাছেরজন আগে
      candidates.sort((a, b) => b.matchScore - a.matchScore || a.distanceKm - b.distanceKm);
      return { radiusKm, candidates };
    }
  }

  return { radiusKm: maxRadiusKm, candidates: [] };
};

module.exports = { findCandidates, scoreCandidate, config: cfg };