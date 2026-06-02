const config = require("../../config/app.config");

function statusTypeUrl(code) {
  return `${config.baseUrl}/status/${code}`;
}

module.exports = { statusTypeUrl };
