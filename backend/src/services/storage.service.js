const { randomUUID } = require("crypto");
const path = require("path");

const supabase = require("../config/supabase");

class StorageService {

    async uploadFile(bucket, file, folder = "") {

        if (!file) {
            throw new Error("No file uploaded.");
        }

        const extension = path.extname(file.originalname);

        const fileName = `${randomUUID()}${extension}`;

        const filePath = folder
            ? `${folder}/${fileName}`
            : fileName;

        const { error } = await supabase.storage

            .from(bucket)

            .upload(filePath, file.buffer, {

                contentType: file.mimetype,

                upsert: false

            });

        if (error) {
            throw error;
        }

        const { data } = supabase.storage

            .from(bucket)

            .getPublicUrl(filePath);

        return {

            bucket,

            path: filePath,

            url: data.publicUrl,

            fileName

        };

    }

    async deleteFile(bucket, filePath) {

        const { error } = await supabase.storage

            .from(bucket)

            .remove([filePath]);

        if (error) {
            throw error;
        }

        return true;

    }

    getPublicUrl(bucket, filePath) {

        const { data } = supabase.storage

            .from(bucket)

            .getPublicUrl(filePath);

        return data.publicUrl;

    }

}

module.exports = new StorageService();
