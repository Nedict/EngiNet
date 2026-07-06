const { z } = require("zod");

const updateProfileSchema = z.object({

    full_name: z.string().min(2).max(100).optional(),

    username: z.string().min(3).max(30).optional(),

    bio: z.string().max(1000).optional(),

    engineering_discipline: z.string().optional(),

    location: z.string().max(100).optional(),

    website: z.string().url().optional(),

    phone: z.string().max(20).optional(),

    avatar_url: z.string().url().optional(),

    cover_image_url: z.string().url().optional()

});

module.exports = {
    updateProfileSchema
};