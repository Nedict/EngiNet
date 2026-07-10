const supabase = require("../config/supabase");

exports.createComment = async (req, res) => {

    try {

        const { post_id, comment } = req.body;

        const { data, error } = await supabase

            .from("comments")

            .insert({

                profile_id: req.user.id,

                post_id,

                comment

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            comment: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getPostComments = async (req, res) => {

    try {

        const { postId } = req.params;

        const { data, error } = await supabase

            .from("comments")

            .select(`
                *,
                profiles(
                    id,
                    first_name,
                    last_name,
                    profile_picture
                )
            `)

            .eq("post_id", postId)

            .order("created_at", {

                ascending: true

            });

        if (error) throw error;

        return res.json({

            success: true,

            comments: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
