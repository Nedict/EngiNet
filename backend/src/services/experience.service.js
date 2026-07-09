const supabase = require("../config/supabase");

exports.createExperience = async (req, res) => {
    try {

        const {
            company_name,
            job_title,
            employment_type,
            location,
            start_date,
            end_date,
            currently_working,
            description
        } = req.body;

        const { data, error } = await supabase
            .from("experience")
            .insert({
                profile_id: req.user.id,
                company_name,
                job_title,
                employment_type,
                location,
                start_date,
                end_date,
                currently_working,
                description
            })
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            experience: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.getMyExperience = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("experience")
            .select("*")
            .eq("profile_id", req.user.id)
            .order("start_date", {
                ascending: false
            });

        if (error) throw error;

        return res.json({
            success: true,
            experience: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.updateExperience = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("experience")
            .update(req.body)
            .eq("id", id)
            .eq("profile_id", req.user.id)
            .select()
            .single();

        if (error) throw error;

        return res.json({
            success: true,
            experience: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.deleteExperience = async (req, res) => {
    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("experience")
            .delete()
            .eq("id", id)
            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({
            success: true,
            message: "Experience deleted successfully."
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
