const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validations/auth.validation");
const { ok } = require("../utils/response");

exports.register = async (req, res, next) => { try { return ok(res, 201, "Registration successful", await authService.register(registerSchema.parse(req.body))); } catch (error) { return next(error); } };
exports.login = async (req, res, next) => { try { return ok(res, 200, "Login successful", await authService.login(loginSchema.parse(req.body))); } catch (error) { return next(error); } };
exports.logout = async (req, res, next) => { try { await authService.logout(); return ok(res, 200, "Logged out successfully", null); } catch (error) { return next(error); } };
exports.me = (req, res) => ok(res, 200, "Current user", { profile: req.user });
