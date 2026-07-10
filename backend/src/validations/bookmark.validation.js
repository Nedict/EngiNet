const { z } = require("zod");

exports.bookmarkSchema = z.object({

    postId: z.string().uuid()

});
