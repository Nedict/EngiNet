const supabase = require("../config/supabase");

exports.createAchievement = async (req, res) => {

    try {

        const {

            title,

            description,

            achievement_date

        } = req.body;

        const { data, error } = await supabase

            .from("achievements")

            .insert({

                profile_id: req.user.id,

                title,

                description,

                achievement_date

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            achievement: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyAchievements = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("achievements")

            .select("*")

            .eq("profile_id", req.user.id)

            .order("achievement_date", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            achievements: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateAchievement = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("achievements")

            .update(req.body)

            .eq("id", id)

            .eq("profile_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            achievement: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteAchievement = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("achievements")

            .delete()

            .eq("id", id)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Achievement deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
