const supabase = require("../config/supabase");

exports.applyForJob = async (req, res) => {

    try {

        const { jobId } = req.params;

        const {

            cover_letter,

            resume_id

        } = req.body;

        const { data: existing } = await supabase

            .from("job_applications")

            .select("id")

            .eq("job_id", jobId)

            .eq("profile_id", req.user.id)

            .maybeSingle();

        if (existing) {

            return res.status(409).json({

                success: false,

                message: "You have already applied for this job."

            });

        }

        const { data, error } = await supabase

            .from("job_applications")

            .insert({

                job_id: jobId,

                profile_id: req.user.id,

                cover_letter,

                resume_id,

                status: "Pending"

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            application: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyApplications = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("job_applications")

            .select(`
                *,
                jobs(
                    title,
                    company_id
                )
            `)

            .eq("profile_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return res.json({

            success: true,

            applications: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
