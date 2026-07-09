const supabase = require("../config/supabase");

exports.createCertification = async (req, res) => {
    try {

        const {
            certificate_name,
            issuing_organization,
            issue_date,
            expiry_date,
            credential_id,
            credential_url
        } = req.body;

        const { data, error } = await supabase
            .from("certifications")
            .insert({
                profile_id: req.user.id,
                certificate_name,
                issuing_organization,
                issue_date,
                expiry_date,
                credential_id,
                credential_url
            })
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            certification: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.getMyCertifications = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("certifications")
            .select("*")
            .eq("profile_id", req.user.id)
            .order("issue_date", { ascending: false });

        if (error) throw error;

        return res.json({
            success: true,
            certifications: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.updateCertification = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("certifications")
            .update(req.body)
            .eq("id", id)
            .eq("profile_id", req.user.id)
            .select()
            .single();

        if (error) throw error;

        return res.json({
            success: true,
            certification: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.deleteCertification = async (req, res) => {
    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("certifications")
            .delete()
            .eq("id", id)
            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({
            success: true,
            message: "Certification deleted successfully."
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
