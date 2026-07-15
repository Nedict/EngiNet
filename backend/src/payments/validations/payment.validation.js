const { z } = require("zod");

exports.initializePaymentSchema = z.object({

    product_id: z.string().uuid(),

    amount: z.number().positive(),

    currency: z.string().default("NGN"),

    customer_name: z.string().min(2),

    customer_email: z.string().email()

});
