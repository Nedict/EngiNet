const marketplaceService = require("../services/marketplace.service");

exports.createListing = (req, res) =>
    marketplaceService.createListing(req, res);

exports.getListings = (req, res) =>
    marketplaceService.getListings(req, res);

exports.getListing = (req, res) =>
    marketplaceService.getListing(req, res);

exports.updateListing = (req, res) =>
    marketplaceService.updateListing(req, res);

exports.deleteListing = (req, res) =>
    marketplaceService.deleteListing(req, res);
