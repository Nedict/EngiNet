const projectService = require("../services/project.service");

exports.getProjects = projectService.getProjects;
exports.createProject = projectService.createProject;
exports.updateProject = projectService.updateProject;
exports.deleteProject = projectService.deleteProject;
