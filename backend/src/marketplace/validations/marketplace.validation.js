const { z } = require("zod");

exports.marketplaceSchema = z.object({

    title: z.string().min(5).max(150),

    description: z.string().min(20),

    category: z.string(),

    price: z.number().nonnegative(),

    currency: z.string().default("NGN"),

    tags: z.array(z.string()).optional(),

    preview_image: z.string().optional(),

    file_url: z.string().optional()

});
