const supabase = require("../config/supabase");

exports.createEducation = async (req, res) => {

    try {

        const {

            institution_name,
            degree,
            department,
            start_year,
            end_year,
            grade,
            currently_studying

        } = req.body;

        const { data, error } = await supabase

            .from("education")

            .insert({

                profile_id: req.user.id,

                institution_name,
                degree,
                department,
                start_year,
                end_year,
                grade,
                currently_studying

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            education: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyEducation = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("education")

            .select("*")

            .eq("profile_id", req.user.id)

            .order("start_year", {
                ascending: false
            });

        if (error) throw error;

        return res.json({

            success: true,

            education: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateEducation = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("education")

            .update(req.body)

            .eq("id", id)

            .eq("profile_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            education: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteEducation = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("education")

            .delete()

            .eq("id", id)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Education deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
