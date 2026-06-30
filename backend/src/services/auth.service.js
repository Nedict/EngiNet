const supabase = require("../config/supabase");
const { success, error } = require("../utils/response");

exports.register = async (req, res) => {
    try {
        const {
            email,
            password,
            accountType
        } = req.body;

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    account_type: accountType
                }
            }
        });

        if (authError) {
            return error(res, authError.message, 400);
        }

        return success(
            res,
            "Registration successful. Please verify your email.",
            data,
            201
        );

    } catch (err) {
        return error(res, err.message);
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const { data, error: authError } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (authError) {
            return error(res, authError.message, 401);
        }

        return success(
            res,
            "Login successful.",
            data
        );

    } catch (err) {
        return error(res, err.message);
    }
};

exports.logout = async (req, res) => {

    await supabase.auth.signOut();

    return success(
        res,
        "Logged out successfully."
    );

};

exports.forgotPassword = async (req, res) => {

};

exports.resetPassword = async (req, res) => {

};
