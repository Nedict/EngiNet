const storageService = require("./storage.service");

const supabase = require("../config/supabase");

exports.getMyProfile = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("profiles")

            .select("*")

            .eq("id", req.user.id)

            .single();

        if (error)
            throw error;

        return res.json({

            success: true,

            profile: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getProfileById = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("profiles")

            .select("*")

            .eq("id", id)

            .single();

        if (error)
            throw error;

        return res.json({

            success: true,

            profile: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateMyProfile = async (req, res) => {

    try {

        const allowedFields = [
    "full_name",
    "username",
    "bio",
    "engineering_discipline",
    "location",
    "website",
    "phone",
    "avatar_url",
    "cover_image_url"
];

const updates = {};

allowedFields.forEach(field => {

    if (req.body[field] !== undefined) {

        updates[field] = req.body[field];

    }

});

        const { data, error } = await supabase

            .from("profiles")

            .update(updates)

            .eq("id", req.user.id)

            .select()

            .single();

        if (error)
            throw error;

        return res.json({

            success: true,

            message: "Profile updated successfully.",

            profile: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.uploadAvatar = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded."

            });

        }

        const extension = req.file.originalname.split(".").pop();

        const path = `${req.user.id}/avatar.${extension}`;

        const url = await storageService.uploadFile(

            "avatars",

            path,

            req.file

        );

        const { data, error } = await supabase

            .from("profiles")

            .update({

                avatar_url: url

            })

            .eq("id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            avatar: data.avatar_url

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};