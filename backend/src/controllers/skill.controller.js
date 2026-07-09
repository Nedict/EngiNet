const skillService = require("../services/skill.service");

exports.addSkill = (req, res) =>
    skillService.addSkill(req, res);

exports.getMySkills = (req, res) =>
    skillService.getMySkills(req, res);

exports.updateSkill = (req, res) =>
    skillService.updateSkill(req, res);

exports.deleteSkill = (req, res) =>
    skillService.deleteSkill(req, res);
