const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const { UnauthorizedError } = require("../shared/errors/http-errors");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or malformed Authorization header", req.path));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch {
    next(new UnauthorizedError("Token is invalid or expired", req.path));
  }
}

module.exports = authenticate;
