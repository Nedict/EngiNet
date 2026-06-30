const supabase = require("../config/supabase");

exports.uploadFile = async (bucket, path, file) => {

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) throw error;

    return data;
};

exports.getPublicUrl = (bucket, path) => {

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};

exports.deleteFile = async (bucket, path) => {

    await supabase.storage
        .from(bucket)
        .remove([path]);

};
