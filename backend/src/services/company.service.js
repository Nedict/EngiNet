const supabase = require("../config/supabase");

const storageService = require("./storage.service");

exports.createCompany = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("companies")

            .insert({

                owner_id: req.user.id,

                ...req.body

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            company: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyCompany = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("companies")

            .select("*")

            .eq("owner_id", req.user.id)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            company: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getCompanyById = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("companies")

            .select("*")

            .eq("id", req.params.id)

            .single();

        if (error) throw error;

        return res.json({

            success: true,

            company: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
