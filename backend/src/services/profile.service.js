const supabase = require("../config/supabase");
const { success, error } = require("../utils/response");
const storageService = require("./storage.service");

exports.getProfile = async (req, res) => {
    try {
        const { data, error: dbError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", req.user.id)
            .single();

        if (dbError) {
            return error(res, dbError.message, 404);
        }

        return success(res, "Profile retrieved successfully.", data);

    } catch (err) {
        return error(res, err.message);
    }
};

exports.updateProfile = async (req, res) => {
    try {

        const {
            full_name,
            engineering_field,
            headline,
            bio,
            location,
            skills,
            education,
            experience
        } = req.body;

        const { data, error: dbError } = await supabase
            .from("profiles")
            .update({
                full_name,
                engineering_field,
                headline,
                bio,
                location,
                skills,
                education,
                experience
            })
            .eq("id", req.user.id)
            .select()
            .single();

        if (dbError) {
            return error(res, dbError.message, 400);
        }

        return success(res, "Profile updated successfully.", data);

    } catch (err) {
        return error(res, err.message);
    }
};

exports.uploadResume = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume is required."
            });
        }

        const path = `${req.user.id}/resume.pdf`;

        await storageService.uploadFile(
            "resumes",
            path,
            req.file
        );

        const url = storageService.getPublicUrl(
            "resumes",
            path
        );

        await supabase
            .from("profiles")
            .update({
                resume_url: url
            })
            .eq("id", req.user.id);

        return res.json({
            success: true,
            resume: url
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.uploadPhoto = async (req, res) => {};
