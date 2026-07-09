const storageService = require("../services/storage.service");

exports.upload = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded."

            });

        }

        const bucket = req.body.bucket;

        const folder = req.body.folder || "";

        const result = await storageService.uploadFile(

            bucket,

            req.file,

            folder

        );

        return res.status(201).json({

            success: true,

            message: "File uploaded successfully.",

            data: result

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.delete = async (req, res) => {

    try {

        const {

            bucket,

            path

        } = req.body;

        await storageService.deleteFile(

            bucket,

            path

        );

        return res.json({

            success: true,

            message: "File deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
