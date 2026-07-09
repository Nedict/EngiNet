const { z } = require("zod");

exports.jobSchema = z.object({

    company_id: z.string().uuid(),

    discipline_id: z.number().int(),

    title: z.string().min(3).max(200),

    description: z.string().min(20),

    employment_type: z.string(),

    location: z.string(),

    salary_min: z.number().optional(),

    salary_max: z.number().optional(),

    experience_required: z.string(),

    application_deadline: z.string()

});
