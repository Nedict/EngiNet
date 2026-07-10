const { z } = require("zod");

exports.postSchema = z.object({

    title: z.string().max(200).optional(),

    content: z.string().min(1).max(10000),

    media_url: z.string().url().optional(),

    media_type: z.string().optional(),

    visibility: z.enum([
        "public",
        "connections",
        "private"
    ])

});
