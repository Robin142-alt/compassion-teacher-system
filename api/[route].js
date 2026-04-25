const { handleVercelRequest } = require("../huruma-api");

module.exports = async function handler(req, res) {
  return handleVercelRequest(req, res);
};
