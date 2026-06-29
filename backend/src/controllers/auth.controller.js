const authService = require("../services/auth.service");

exports.register = authService.register;

exports.login = authService.login;

exports.logout = authService.logout;

exports.forgotPassword = authService.forgotPassword;

exports.resetPassword = authService.resetPassword;
