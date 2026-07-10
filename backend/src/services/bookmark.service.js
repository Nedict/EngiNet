const supabase = require("../config/supabase");

exports.toggleBookmark = async (req, res) => {

    try {

        const { postId } = req.params;

        const { data: existing } = await supabase

            .from("bookmarks")

            .select("id")

            .eq("post_id", postId)

            .eq("profile_id", req.user.id)

            .maybeSingle();

        if (existing) {

            await supabase

                .from("bookmarks")

                .delete()

                .eq("id", existing.id);

            return res.json({

                success: true,

                bookmarked: false

            });

        }

        const { error } = await supabase

            .from("bookmarks")

            .insert({

                post_id: postId,

                profile_id: req.user.id

            });

        if (error) throw error;

        return res.json({

            success: true,

            bookmarked: true

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getBookmarks = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("bookmarks")

            .select(`
                *,
                posts(*)
            `)

            .eq("profile_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            bookmarks: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
