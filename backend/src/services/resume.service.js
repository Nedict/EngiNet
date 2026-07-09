const path = require("path");

const supabase = require("../config/supabase");
const storageService = require("./storage.service");

exports.uploadResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Resume file is required."
            });

        }

        const extension = path.extname(req.file.originalname);

        const fileName =
            `${req.user.id}_${Date.now()}${extension}`;

        const storagePath =
            `${req.user.id}/${fileName}`;

        const publicUrl =
            await storageService.uploadFile(
                "resumes",
                storagePath,
                req.file
            );

        const { data, error } = await supabase

            .from("resumes")

            .insert({

                profile_id: req.user.id,

                file_name: req.file.originalname,

                file_url: publicUrl,

                file_size: req.file.size,

                mime_type: req.file.mimetype

            })

            .select()

            .single();

        if (error) throw error;

        return res.status(201).json({

            success: true,

            message: "Resume uploaded successfully.",

            resume: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyResume = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("resumes")

            .select("*")

            .eq("profile_id", req.user.id)

            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        return res.json({

            success: true,

            resumes: data

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteResume = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase

            .from("resumes")

            .select("*")

            .eq("id", id)

            .eq("profile_id", req.user.id)

            .single();

        if (error) throw error;

        const storagePath =
            data.file_url.split("/resumes/")[1];

        await supabase.storage

            .from("resumes")

            .remove([storagePath]);

        const { error: deleteError } = await supabase

            .from("resumes")

            .delete()

            .eq("id", id);

        if (deleteError) throw deleteError;

        return res.json({

            success: true,

            message: "Resume deleted successfully."

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
