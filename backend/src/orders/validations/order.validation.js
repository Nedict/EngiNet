const { z } = require("zod");

exports.orderIdSchema = z.object({

    id: z.string().uuid()

});
