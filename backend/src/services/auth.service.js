const supabase = require("../config/supabase");

exports.register = async (req, res) => {

    try {

        const {
            email,
            password,
            full_name,
            account_type
        } = req.body;

        const { data, error } = await supabase.auth.signUp({

            email,

            password,

            options: {

                data: {
                    full_name,
                    account_type
                }

            }

        });

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        return res.status(201).json({

            success: true,

            message: "Registration successful. Please verify your email.",

            user: data.user

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email,

                password

            });

        if (error) {

            return res.status(401).json({

                success: false,

                message: error.message

            });

        }

        return res.json({

            success: true,

            session: data.session,

            user: data.user

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.logout = async (req, res) => {

    try {

        const { error } = await supabase.auth.signOut();

        if (error) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

        return res.json({

            success: true,

            message: "Logged out successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.me = async (req, res) => {

    try {

        return res.json({

            success: true,

            user: req.user

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};