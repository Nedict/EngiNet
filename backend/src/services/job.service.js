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
