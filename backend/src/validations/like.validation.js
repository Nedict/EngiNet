const { z } = require("zod");

exports.likeSchema = z.object({

    postId: z.string().uuid()

});
