const { z } = require("zod");

exports.chatSchema = z.object({

    participant_ids: z.array(

        z.string().uuid()

    ).min(1),

    name: z.string().optional(),

    is_group: z.boolean().optional()

});
