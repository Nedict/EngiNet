const response = require("../utils/response");
module.exports = (error, req, res, next) => {
  const status = Number(error.status) || (error.name === "ZodError" ? 400 : 500);
  const code = error.name === "ZodError" ? "VALIDATION_ERROR" : status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR";
  const message = status === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : error.name === "ZodError" ? "Request validation failed" : error.message;
  return response.fail(res, status, message, code);
};
