const supabase = require("../config/supabase");

exports.authenticate = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required."
            });
        }

        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        req.user = user;

        next();

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
