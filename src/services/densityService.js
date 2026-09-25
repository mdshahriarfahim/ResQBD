/**
 * services/densityService.js
 * --------------------------
 * priority algorithm-এর জন্য জনঘনত্ব খোঁজা হয় এখান থেকে।
 * প্রথমে exact upazila খোঁজা হয়, না পেলে পুরো district খোঁজা হয়।
 * কিছুই না পেলে null রিটার্ন হয় (= "available না"), আর priority
 * algorithm তখন density-তে ০ পয়েন্ট দেয়, আর explanation-এ সেটা বলে দেয়।
 */
const AreaDensity = require('../models/AreaDensity');
const { getPagination, buildPageInfo } = require('../utils/pagination');
const { escapeRegex } = require('../utils/regex');

const clean = (text) => (text ? String(text).trim().toLowerCase() : '');

const makeKey = (district, upazila) =>
  [clean(district), clean(upazila)].filter(Boolean).join('|');

/**
 * @returns {{ populationDensity: number|null, matchedOn: string|null }}
 */
const getDensity = async (district, upazila) => {
  if (!clean(district)) return { populationDensity: null, matchedOn: null };

  if (clean(upazila)) {
    const exact = await AreaDensity.findOne({ key: makeKey(district, upazila) }).lean();
    if (exact) return { populationDensity: exact.populationDensity, matchedOn: 'upazila' };
  }

  const byDistrict = await AreaDensity.findOne({ key: makeKey(district) }).lean();
  if (byDistrict) return { populationDensity: byDistrict.populationDensity, matchedOn: 'district' };

  return { populationDensity: null, matchedOn: null };
};

const upsertDensity = async ({ district, upazila, populationDensity, source }) => {
  const key = makeKey(district, upazila);
  return AreaDensity.findOneAndUpdate(
    { key },
    {
      $set: {
        district: district.trim(),
        upazila: upazila ? upazila.trim() : undefined,
        populationDensity,
        source,
        key,
      },
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
};

const listDensities = async ({ search, page, limit } = {}) => {
  const pagination = getPagination({ page, limit });
  const filter = {};
  if (search) filter.district = new RegExp(escapeRegex(search), 'i');

  const [items, total] = await Promise.all([
    AreaDensity.find(filter).sort({ district: 1, upazila: 1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    AreaDensity.countDocuments(filter),
  ]);

  return { items, pagination: buildPageInfo(total, pagination.page, pagination.limit) };
};

module.exports = { getDensity, upsertDensity, listDensities, makeKey };