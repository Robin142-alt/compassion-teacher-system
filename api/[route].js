const { handleVercelRequest } = require("../server");

module.exports = async function handler(req, res) {
  return handleVercelRequest(req, res);
};
