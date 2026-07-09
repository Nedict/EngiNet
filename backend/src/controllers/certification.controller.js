const certificationService = require("../services/certification.service");

exports.createCertification = (req, res) => {
    return certificationService.createCertification(req, res);
};

exports.getMyCertifications = (req, res) => {
    return certificationService.getMyCertifications(req, res);
};

exports.updateCertification = (req, res) => {
    return certificationService.updateCertification(req, res);
};

exports.deleteCertification = (req, res) => {
    return certificationService.deleteCertification(req, res);
};
