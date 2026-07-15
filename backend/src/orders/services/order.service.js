const supabase = require("../../config/supabase");

exports.getMyOrders = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("orders")

            .select(`
                *,
                marketplace_items(
                    id,
                    title,
                    preview_image,
                    price
                )
            `)

            .eq("buyer_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            orders: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMySales = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("orders")

            .select(`
                *,
                marketplace_items!inner(
                    id,
                    title,
                    seller_id
                )
            `)

            .eq("marketplace_items.seller_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            sales: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("orders")

            .select("*")

            .eq("id", id)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            order: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
