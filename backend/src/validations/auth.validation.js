const { z } = require("zod");
exports.registerSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(72), full_name: z.string().trim().min(2).max(100), account_type: z.enum(["individual", "company"]).default("individual") });
exports.loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(72) });
