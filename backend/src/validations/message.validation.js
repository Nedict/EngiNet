const { z } = require("zod");

exports.messageSchema = z.object({

    message: z.string().min(1).max(10000),

    attachment_url: z.string().url().optional(),

    attachment_type: z.string().optional()

});
