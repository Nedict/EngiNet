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

exports.getMyPosts = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select("*")

            .eq("profile_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            posts: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getPost = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select(`
                *,
                profiles(*)
            `)

            .eq("id", req.params.id)

            .single();

        if (error) throw error;

        return res.json({

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

exports.updatePost = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("posts")

            .update(req.body)

            .eq("id", req.params.id)

            .eq("profile_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

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

exports.deletePost = async (req, res) => {

    try {

        const { error } = await supabase

            .from("posts")

            .delete()

            .eq("id", req.params.id)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Post deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
