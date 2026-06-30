const supabase = require("../config/supabase");
const { success, error } = require("../utils/response");

exports.register = async (req, res) => {
    try {

        const {
            email,
            password,
            accountType
        } = req.body;

        const { data, error: authError } =
            await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: false
            });

        if (authError) {
            return error(res, authError.message, 400);
        }

        return success(
            res,
            "Account created successfully.",
            {
                user: data.user,
                accountType
            },
            201
        );

    } catch (err) {

        return error(res, err.message);

    }
};
