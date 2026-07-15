const supabase = require("../../config/supabase");

exports.createListing = async (req, res) => {

    try {

        const {

            title,
            description,
            category,
            price,
            currency,
            tags,
            preview_image,
            file_url

        } = req.body;

        const { data, error } = await supabase

            .from("marketplace_items")

            .insert({

                seller_id: req.user.id,

                title,

                description,

                category,

                price,

                currency,

                tags,

                preview_image,

                file_url

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            listing: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getListings = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("marketplace_items")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            listings: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getListing = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("marketplace_items")

            .select(`
                *,
                profiles(
                    id,
                    first_name,
                    last_name,
                    profile_picture,
                    headline
                )
            `)

            .eq("id", id)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            listing: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateListing = async (req, res) => {

    try {

        const { id } = req.params;

        const updateData = {

            ...req.body,

            updated_at: new Date().toISOString()

        };

        const { data, error } = await supabase

            .from("marketplace_items")

            .update(updateData)

            .eq("id", id)

            .eq("seller_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            listing: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteListing = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("marketplace_items")

            .delete()

            .eq("id", id)

            .eq("seller_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Listing deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
