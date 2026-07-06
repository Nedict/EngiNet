const supabase = require("../config/supabase");

exports.uploadFile = async (bucket, path, file) => {

    const { error } = await supabase.storage

        .from(bucket)

        .upload(path, file.buffer, {

            upsert: true,

            contentType: file.mimetype

        });

    if (error) throw error;

    const { data } = supabase.storage

        .from(bucket)

        .getPublicUrl(path);

    return data.publicUrl;

};