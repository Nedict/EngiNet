const supabase = require("../config/supabase");

exports.toggleLike = async (req, res) => {

    try {

        const { postId } = req.params;

        const { data: existing } = await supabase

            .from("likes")

            .select("id")

            .eq("post_id", postId)

            .eq("profile_id", req.user.id)

            .maybeSingle();

        if (existing) {

            await supabase

                .from("likes")

                .delete()

                .eq("id", existing.id);

            return res.json({

                success: true,

                liked: false

            });

        }

        const { error } = await supabase

            .from("likes")

            .insert({

                post_id: postId,

                profile_id: req.user.id

            });

        if (error) throw error;

        return res.json({

            success: true,

            liked: true

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getPostLikes = async (req, res) => {

    try {

        const { postId } = req.params;

        const { data, error } = await supabase

            .from("likes")

            .select("profile_id")

            .eq("post_id", postId);

        if (error) throw error;

        return res.json({

            success: true,

            total: data.length,

            likes: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
