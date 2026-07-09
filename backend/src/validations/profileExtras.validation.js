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
    employment_type: z.string(),
    location: z.string().optional(),
    start_date: z.string(),
    end_date: z.string().nullable().optional(),
    currently_working: z.boolean().optional(),
    description: z.string().optional()
});

exports.certificationSchema = z.object({
    certificate_name: z.string().min(2),
    issuing_organization: z.string().min(2),
    issue_date: z.string(),
    expiry_date: z.string().nullable().optional(),
    credential_id: z.string().optional(),
    credential_url: z.string().url().optional()
});

exports.achievementSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    achievement_date: z.string()
});

exports.profileLinkSchema = z.object({
    platform: z.string().min(2),
    url: z.string().url()
});

exports.skillSchema = z.object({
    skill_id: z.string().uuid(),
    proficiency_level: z.string().min(2),
    years_of_experience: z.number().int().min(0)
});
