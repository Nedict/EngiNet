const { z } = require("zod");

exports.commentSchema = z.object({

    post_id: z.string().uuid(),

    comment: z.string().min(1).max(5000)

});
