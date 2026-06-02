const { HttpError } = require("../shared/errors/http-errors");
const { statusTypeUrl } = require("../shared/utils/problem.util");
const { getStatusDefinition } = require("../config/http-statuses");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .set("Content-Type", "application/problem+json")
      .json(err.toJSON());
  }

  console.error("[Unhandled Error]", err);

  return res
    .status(500)
    .set("Content-Type", "application/problem+json")
    .json({
      type: statusTypeUrl(500),
      title: getStatusDefinition(500).title,
      status: 500,
      detail: "An unexpected error occurred",
      instance: req.path,
    });
}

module.exports = errorHandler;
