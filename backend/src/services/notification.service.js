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

exports.markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("notifications")

            .update({

                is_read: true

            })

            .eq("id", id)

            .eq("recipient_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            notification: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.markAllAsRead = async (req, res) => {

    try {

        const { error } = await supabase

            .from("notifications")

            .update({

                is_read: true

            })

            .eq("recipient_id", req.user.id)

            .eq("is_read", false);

        if (error) throw error;

        return res.json({

            success: true,

            message: "All notifications marked as read."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteNotification = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("notifications")

            .delete()

            .eq("id", id)

            .eq("recipient_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Notification deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
