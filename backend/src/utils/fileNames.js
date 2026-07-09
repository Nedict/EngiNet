const crypto = require("crypto");
const path = require("path");

exports.generateFileName = (originalName) => {

    const extension = path.extname(originalName);

    return `${Date.now()}-${crypto.randomUUID()}${extension}`;

};
