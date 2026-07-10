const supabase = require("../config/supabase");

exports.createPost = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .insert({

                profile_id: req.user.id,

                ...req.body

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            post: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getFeed = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select(`
                *,
                profiles(
                    id,
                    first_name,
                    last_name,
                    profile_picture
                )
            `)

            .eq("visibility", "public")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            feed: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
