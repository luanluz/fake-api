const HTTP_STATUSES = {
  400: {
    title: "Bad Request",
    class: "4xx Client Error",
    description:
      "The server cannot process the request due to a client error (malformed syntax, invalid query param, etc.).",
    rfc: "RFC 9110, Section 15.5.1",
    usedInApi: true,
    typicalCauses: ["Invalid query parameter value", "Malformed request syntax"],
  },
  401: {
    title: "Unauthorized",
    class: "4xx Client Error",
    description:
      "Authentication is required and has failed or has not been provided.",
    rfc: "RFC 9110, Section 15.5.2",
    usedInApi: true,
    typicalCauses: ["Missing Authorization header", "Invalid or expired JWT"],
  },
  403: {
    title: "Forbidden",
    class: "4xx Client Error",
    description: "The server understood the request but refuses to authorize it.",
    rfc: "RFC 9110, Section 15.5.4",
    usedInApi: false,
    typicalCauses: ["Insufficient permissions for the resource"],
  },
  404: {
    title: "Not Found",
    class: "4xx Client Error",
    description: "The requested resource could not be found.",
    rfc: "RFC 9110, Section 15.5.5",
    usedInApi: true,
    typicalCauses: ["Unknown route", "Todo or user id does not exist"],
  },
  409: {
    title: "Conflict",
    class: "4xx Client Error",
    description: "The request conflicts with the current state of the resource.",
    rfc: "RFC 9110, Section 15.5.10",
    usedInApi: true,
    typicalCauses: ["Email already registered"],
  },
  422: {
    title: "Unprocessable Entity",
    class: "4xx Client Error",
    description:
      "The request was well-formed but could not be processed due to semantic validation errors.",
    rfc: "RFC 4918",
    usedInApi: true,
    typicalCauses: ["Missing required fields", "Invalid enum value", "Invalid date format"],
    fieldsNote: "Responses may include an `errors` array with per-field messages.",
  },
  500: {
    title: "Internal Server Error",
    class: "5xx Server Error",
    description: "An unexpected error occurred on the server.",
    rfc: "RFC 9110, Section 15.6.1",
    usedInApi: true,
    typicalCauses: ["Unhandled exception"],
  },
};

function getStatusDefinition(code) {
  return HTTP_STATUSES[code] ?? null;
}

function listStatusDefinitions() {
  return Object.entries(HTTP_STATUSES)
    .map(([code, def]) => ({ code: Number(code), ...def }))
    .sort((a, b) => a.code - b.code);
}

module.exports = { HTTP_STATUSES, getStatusDefinition, listStatusDefinitions };
