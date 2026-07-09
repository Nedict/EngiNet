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

exports.updateCompany = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("companies")

            .update(req.body)

            .eq("id", id)

            .eq("owner_id", req.user.id)

            .select()

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

exports.deleteCompany = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase

            .from("companies")

            .delete()

            .eq("id", id)

            .eq("owner_id", req.user.id);

        if (error) throw error;

        return res.json({

            success: true,

            message: "Company deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.uploadLogo = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Logo file is required."

            });

        }

        const upload = await storageService.uploadFile(

            "company-logos",

            req.file,

            req.user.id

        );

        const { data, error } = await supabase

            .from("companies")

            .update({

                logo_url: upload.url

            })

            .eq("owner_id", req.user.id)

            .select()

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

exports.uploadBanner = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Banner file is required."

            });

        }

        const upload = await storageService.uploadFile(

            "company-banners",

            req.file,

            req.user.id

        );

        const { data, error } = await supabase

            .from("companies")

            .update({

                banner_url: upload.url

            })

            .eq("owner_id", req.user.id)

            .select()

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
