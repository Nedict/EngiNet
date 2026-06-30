const { z } = require("zod");

const profileSchema = z.object({

    full_name: z.string().min(2),

    engineering_field: z.string().min(2),

    headline: z.string().optional(),

    bio: z.string().optional(),

    location: z.string().optional(),

    skills: z.array(z.string()).optional(),

    education: z.array(z.any()).optional(),

    experience: z.array(z.any()).optional()

});

exports.validateProfile = (req, res, next) => {

    const result = profileSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten()
        });
    }

    next();

};
