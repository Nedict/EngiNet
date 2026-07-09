const { z } = require("zod");

exports.uploadSchema = z.object({

    bucket: z.string().min(1),

    folder: z.string().optional()

});
