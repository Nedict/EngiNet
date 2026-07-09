const supabase = require("../config/supabase");

exports.createJob = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("jobs")

            .insert(req.body)

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            job: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getAllJobs = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("jobs")

            .select(`
                *,
                companies(company_name,logo_url),
                engineering_disciplines(name)
            `)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            jobs: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getJob = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("jobs")

            .select(`
                *,
                companies(*),
                engineering_disciplines(*)
            `)

            .eq("id", req.params.id)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            job: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getCompanyJobs = async (req, res) => {

    try {

        const { companyId } = req.params;

        const { data, error } = await supabase

            .from("jobs")

            .select("*")

            .eq("company_id", companyId)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            jobs: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getJobsByDiscipline = async (req, res) => {

    try {

        const { disciplineId } = req.params;

        const { data, error } = await supabase

            .from("jobs")

            .select("*")

            .eq("discipline_id", disciplineId)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            jobs: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateJob = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("jobs")

            .update(req.body)

            .eq("id", id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            job: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteJob = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("jobs")

            .delete()

            .eq("id", id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Job deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
