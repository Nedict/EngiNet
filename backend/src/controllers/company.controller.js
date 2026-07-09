const companyService = require("../services/company.service");

exports.createCompany = (req, res) =>
    companyService.createCompany(req, res);

exports.getMyCompany = (req, res) =>
    companyService.getMyCompany(req, res);

exports.getCompanyById = (req, res) =>
    companyService.getCompanyById(req, res);

exports.updateCompany = (req, res) =>
    companyService.updateCompany(req, res);

exports.deleteCompany = (req, res) =>
    companyService.deleteCompany(req, res);

exports.uploadLogo = (req, res) =>
    companyService.uploadLogo(req, res);

exports.uploadBanner = (req, res) =>
    companyService.uploadBanner(req, res);
