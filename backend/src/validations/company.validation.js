const { z } = require("zod");

exports.companySchema = z.object({

    company_name: z.string().min(2).max(150),

    engineering_sector: z.string().min(2),

    description: z.string().max(5000).optional(),

    website: z.string().url().optional(),

    email: z.string().email(),

    phone: z.string().optional(),

    headquarters: z.string().optional()

});
