const supabase = require("../config/supabase");

exports.createProfileLink = async (req, res) => {

    try {

        const {

            platform,

            url

        } = req.body;

        const { data, error } = await supabase

            .from("profile_links")

            .insert({

                profile_id: req.user.id,

                platform,

                url

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            profileLink: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyProfileLinks = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("profile_links")

            .select("*")

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            profileLinks: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateProfileLink = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("profile_links")

            .update(req.body)

            .eq("id", id)

            .eq("profile_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            profileLink: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteProfileLink = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("profile_links")

            .delete()

            .eq("id", id)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Profile link deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
