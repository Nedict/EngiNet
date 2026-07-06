const authService = require("../services/auth.service");

exports.register = (req, res) => authService.register(req, res);

exports.login = (req, res) => authService.login(req, res);

exports.logout = (req, res) => authService.logout(req, res);

exports.me = (req, res) => authService.me(req, res);