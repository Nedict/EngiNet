const supabase = require("../config/supabase");

exports.getHomeFeed = async (req, res) => {

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

            })

            .limit(25);

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

exports.getLatestFeed = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select("*")

            .order("created_at", {

                ascending: false

            })

            .limit(25);

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
