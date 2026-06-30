const upload = require("../uploads/multer");

exports.uploadSingle = upload.single("file");

exports.uploadMultiple = upload.array("files", 10);
