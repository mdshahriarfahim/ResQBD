/**
 * utils/pagination.js
 * -------------------
 * List endpoint-এর জন্য helper: ?page=2&limit=20
 */
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getPagination = ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || DEFAULT_LIMIT));
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
};

const buildPageInfo = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

module.exports = { getPagination, buildPageInfo, DEFAULT_LIMIT, MAX_LIMIT };