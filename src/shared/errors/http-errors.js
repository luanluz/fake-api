const { getStatusDefinition } = require("../../config/http-statuses");
const { statusTypeUrl } = require("../utils/problem.util");

function resolveTitle(status) {
  return getStatusDefinition(status)?.title || "Error";
}

class HttpError extends Error {
  constructor(status, detail, instance = null) {
    super(detail);
    this.status = status;
    this.title = resolveTitle(status);
    this.detail = detail;
    this.instance = instance;
  }

  toJSON() {
    return {
      type: statusTypeUrl(this.status),
      title: this.title,
      status: this.status,
      detail: this.detail,
      ...(this.instance && { instance: this.instance }),
    };
  }
}

class BadRequestError extends HttpError {
  constructor(detail, instance = null) {
    super(400, detail, instance);
  }
}

class UnauthorizedError extends HttpError {
  constructor(detail = "Authentication required", instance = null) {
    super(401, detail, instance);
  }
}

class NotFoundError extends HttpError {
  constructor(detail, instance = null) {
    super(404, detail, instance);
  }
}

class ConflictError extends HttpError {
  constructor(detail, instance = null) {
    super(409, detail, instance);
  }
}

class UnprocessableEntityError extends HttpError {
  constructor(detail, errors = [], instance = null) {
    super(422, detail, instance);
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...(this.errors.length > 0 && { errors: this.errors }),
    };
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
};
