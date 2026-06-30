const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    accountType: z.enum(["personal", "company"])
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

exports.validateRegister = (req, res, next) => {

    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten()
        });
    }

    next();
};

exports.validateLogin = (req, res, next) => {

    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten()
        });
    }

    next();
};
