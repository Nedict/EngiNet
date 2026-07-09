const { z } = require("zod");

exports.applicationSchema = z.object({

    cover_letter: z.string().max(5000).optional(),

    resume_id: z.string().uuid().optional()

});

exports.statusSchema = z.object({

    status: z.enum([
        "Pending",
        "Reviewed",
        "Shortlisted",
        "Interview",
        "Accepted",
        "Rejected"
    ])

});
