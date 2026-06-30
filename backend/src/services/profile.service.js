const supabase = require("../config/supabase");

const { success, error } = require("../utils/response");

exports.getProfile = async (req, res) => {

    const { data, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", req.user.id)
        .single();

    if (dbError) {
        return error(res, dbError.message, 404);
    }

    return success(
        res,
        "Profile retrieved successfully.",
        data
    );

};

exports.updateProfile = async (req, res) => {};

exports.uploadResume = async (req, res) => {};

exports.uploadPhoto = async (req, res) => {};
