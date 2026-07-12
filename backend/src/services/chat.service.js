const supabase = require("../config/supabase");

exports.createChat = async (req, res) => {

    try {

        const {

            participant_ids,

            name,

            is_group = false

        } = req.body;

        const { data: chat, error } = await supabase

            .from("chats")

            .insert({

                name,

                is_group,

                created_by: req.user.id

            })

            .select()

            .single();

        if (error) throw error;

        const members = [

            req.user.id,

            ...participant_ids

        ].map(profileId => ({

            chat_id: chat.id,

            profile_id: profileId

        }));

        const { error: memberError } = await supabase

            .from("chat_members")

            .insert(members);

        if (memberError) throw memberError;

        return res.status(201).json({

            success: true,

            chat

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getChats = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("chat_members")

            .select(`
                chats(
                    *,
                    messages(
                        id,
                        message,
                        sender_id,
                        created_at
                    )
                )
            `)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            chats: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const { data, error } = await supabase

            .from("chats")

            .select(`
                *,
                chat_members(
                    profile_id,
                    profiles(
                        id,
                        first_name,
                        last_name,
                        profile_picture
                    )
                )
            `)

            .eq("id", chatId)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            chat: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const { error } = await supabase

            .from("chats")

            .delete()

            .eq("id", chatId);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Chat deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
