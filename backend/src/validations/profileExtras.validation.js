const { z } = require("zod");

exports.educationSchema = z.object({

    institution_name: z.string().min(2).max(150),

    degree: z.string().min(2).max(100),

    department: z.string().min(2).max(100),

    start_year: z.number().int(),

    end_year: z.number().int().nullable().optional(),

    grade: z.string().max(50).optional(),

    currently_studying: z.boolean().optional()

});

exports.experienceSchema = z.object({

    company_name: z.string().min(2).max(150),

    job_title: z.string().min(2).max(100),

    employment_type: z.string().max(50),

    location: z.string().max(150).optional(),

    start_date: z.string(),

    end_date: z.string().nullable().optional(),

    currently_working: z.boolean().optional(),

    description: z.string().max(3000).optional()

});

exports.resumeSchema = z.object({

    file_name: z.string().optional(),

    file_url: z.string().optional(),

    mime_type: z.string().optional(),

    file_size: z.number().optional()

});
