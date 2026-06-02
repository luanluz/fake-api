const packageJson = require("../../package.json");

function envInt(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const host = process.env.HOST || "localhost";
const port = envInt("PORT", 3000);

const baseUrl = (process.env.BASE_URL || `http://${host}:${port}`).replace(/\/$/, "");

const config = {
  name: process.env.APP_NAME || "Fake API",
  version: process.env.APP_VERSION || packageJson.version,
  host,
  port,
  baseUrl,
  jwt: {
    secret: process.env.JWT_SECRET || "fake-api-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  seed: {
    password: process.env.SEED_PASSWORD || "password123",
  },
  pagination: {
    defaultPage: envInt("PAGINATION_DEFAULT_PAGE", 1),
    defaultLimit: envInt("PAGINATION_DEFAULT_LIMIT", 10),
    maxLimit: envInt("PAGINATION_MAX_LIMIT", 100),
  },
};

module.exports = config;
