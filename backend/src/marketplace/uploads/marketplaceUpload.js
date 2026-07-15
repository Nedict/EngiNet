const multer = require("multer");

const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowed = [

        ".pdf",
        ".zip",
        ".rar",
        ".dwg",
        ".dxf",
        ".step",
        ".stp",
        ".kicad_pcb",
        ".kicad_sch",
        ".ino",
        ".hex",
        ".docx",
        ".xlsx",
        ".pptx",
        ".png",
        ".jpg",
        ".jpeg"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(extension)) {

        cb(null, true);

    } else {

        cb(new Error("Unsupported marketplace file type."));

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024

    }

});
