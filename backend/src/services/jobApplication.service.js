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

exports.getCompanyApplications = async (req, res) => {

    try {

        const { companyId } = req.params;

        const { data, error } = await supabase

            .from("job_applications")

            .select(`
                *,
                profiles(
                    id,
                    first_name,
                    last_name,
                    profile_picture
                ),
                jobs!inner(
                    id,
                    title,
                    company_id
                )
            `)

            .eq("jobs.company_id", companyId)

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

exports.updateApplicationStatus = async (req, res) => {

    try {

        const { applicationId } = req.params;

        const { status } = req.body;

        const { data, error } = await supabase

            .from("job_applications")

            .update({

                status

            })

            .eq("id", applicationId)

            .select()

            .single();

        if (error) throw error;

        return res.json({

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

exports.withdrawApplication = async (req, res) => {

    try {

        const { applicationId } = req.params;

        const { error } = await supabase

            .from("job_applications")

            .delete()

            .eq("id", applicationId)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Application withdrawn successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getApplicationStatistics = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("job_applications")

            .select("status")

            .eq("profile_id", req.user.id);

        if (error) throw error;

        const statistics = {

            total: data.length,

            pending: data.filter(a => a.status === "Pending").length,

            reviewed: data.filter(a => a.status === "Reviewed").length,

            shortlisted: data.filter(a => a.status === "Shortlisted").length,

            interview: data.filter(a => a.status === "Interview").length,

            accepted: data.filter(a => a.status === "Accepted").length,

            rejected: data.filter(a => a.status === "Rejected").length

        };

        return res.json({

            success: true,

            statistics

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
