const supabase = require("../config/supabase");

exports.sendMessage = async (req, res) => {

    try {

        const { chatId } = req.params;

        const {

            message,

            attachment_url,

            attachment_type

        } = req.body;

        const { data, error } = await supabase

            .from("messages")

            .insert({

                chat_id: chatId,

                sender_id: req.user.id,

                message,

                attachment_url,

                attachment_type

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            message: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMessages = async (req, res) => {

    try {

        const { chatId } = req.params;

        const { data, error } = await supabase

            .from("messages")

            .select(`
                *,
                profiles(
                    id,
                    first_name,
                    last_name,
                    profile_picture
                )
            `)

            .eq("chat_id", chatId)

            .order("created_at", {

                ascending: true

            });

        if (error) throw error;

        return res.json({

            success: true,

            messages: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
