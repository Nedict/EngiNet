const supabase = require("../config/supabase");

exports.getNotifications = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("notifications")

            .select("*")

            .eq("recipient_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            notifications: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getUnreadNotifications = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("notifications")

            .select("*")

            .eq("recipient_id", req.user.id)

            .eq("is_read", false)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            notifications: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
