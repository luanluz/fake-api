const config = require("../../config/app.config");

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || config.pagination.defaultPage);
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(query.limit) || config.pagination.defaultLimit)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildPaginatedResponse(items, page, limit, offset) {
  const total = items.length;
  const data = items.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

module.exports = { parsePagination, buildPaginatedResponse };
