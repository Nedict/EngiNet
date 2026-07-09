const supabase = require("../config/supabase");

exports.addSkill = async (req, res) => {

    try {

        const {

            skill_id,
            proficiency_level,
            years_of_experience

        } = req.body;

        const { data, error } = await supabase

            .from("profile_skills")

            .insert({

                profile_id: req.user.id,

                skill_id,

                proficiency_level,

                years_of_experience

            })

            .select(`
                *,
                skills(*)
            `)

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            skill: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMySkills = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("profile_skills")

            .select(`
                *,
                skills(*)
            `)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            skills: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateSkill = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("profile_skills")

            .update(req.body)

            .eq("id", id)

            .eq("profile_id", req.user.id)

            .select()

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            skill: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteSkill = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("profile_skills")

            .delete()

            .eq("id", id)

            .eq("profile_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Skill deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
