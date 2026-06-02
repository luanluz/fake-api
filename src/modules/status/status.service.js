const config = require("../../config/app.config");
const {
  getStatusDefinition,
  listStatusDefinitions,
} = require("../../config/http-statuses");
const { statusTypeUrl } = require("../../shared/utils/problem.util");
const { NotFoundError } = require("../../shared/errors/http-errors");

function buildProblemExample(code, title, detail, instance = "/example") {
  const body = {
    type: statusTypeUrl(code),
    title,
    status: code,
    detail,
    instance,
  };

  if (code === 422) {
    body.errors = [{ field: "title", message: "Title is required" }];
  }

  return body;
}

const StatusService = {
  list() {
    const statuses = listStatusDefinitions().map((def) => ({
      code: def.code,
      title: def.title,
      class: def.class,
      type: statusTypeUrl(def.code),
      usedInApi: def.usedInApi,
    }));

    return {
      name: config.name,
      baseUrl: config.baseUrl,
      statuses,
    };
  },

  getByCode(codeParam) {
    const code = parseInt(codeParam, 10);

    if (Number.isNaN(code) || code < 100 || code > 599) {
      throw new NotFoundError(
        `Status code '${codeParam}' is not a valid HTTP status`,
        `/status/${codeParam}`
      );
    }

    const definition = getStatusDefinition(code);

    if (!definition) {
      throw new NotFoundError(
        `Status code ${code} is not documented in this API`,
        `/status/${code}`
      );
    }

    const { title, description, class: statusClass, rfc, usedInApi, typicalCauses, fieldsNote } =
      definition;

    const detail =
      code === 422
        ? "Validation failed"
        : code === 404
        ? "Resource not found"
        : code === 401
        ? "Authentication required"
        : code === 400
        ? "Invalid request"
        : code === 409
        ? "Resource conflict"
        : code === 500
        ? "An unexpected error occurred"
        : title;

    return {
      code,
      title,
      description,
      class: statusClass,
      rfc,
      usedInApi,
      typicalCauses,
      ...(fieldsNote && { fieldsNote }),
      type: statusTypeUrl(code),
      problemDetails: {
        contentType: "application/problem+json",
        specification: "RFC 7807",
        example: buildProblemExample(code, title, detail, `/status/${code}`),
      },
    };
  },
};

module.exports = StatusService;
