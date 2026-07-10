const { z } = require("zod");

exports.notificationSchema = z.object({

    recipient_id: z.string().uuid(),

    sender_id: z.string().uuid().optional(),

    notification_type: z.string(),

    title: z.string().max(200),

    message: z.string().max(2000)

});
