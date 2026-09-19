const response = require("../utils/response");
module.exports = (req, res) => response.fail(res, 404, "Route not found", "NOT_FOUND");
