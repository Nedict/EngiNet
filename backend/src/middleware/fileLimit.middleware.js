module.exports = (maxSize = 10 * 1024 * 1024) => {

    return (req, res, next) => {

        if (!req.file) {

            return next();

        }

        if (req.file.size > maxSize) {

            return res.status(413).json({

                success: false,

                message: `Maximum upload size is ${Math.floor(maxSize / (1024 * 1024))} MB.`

            });

        }

        next();

    };

};
