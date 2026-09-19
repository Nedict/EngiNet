const supabase = require("../config/supabase");

module.exports = async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header || !/^Bearer\s+\S+$/.test(header)) return res.status(401).json({ success: false, message: "Authentication required", error: { code: "AUTH_REQUIRED" } });
    if (!supabase) return res.status(503).json({ success: false, message: "Authentication service unavailable", error: { code: "AUTH_UNAVAILABLE" } });
    const token = header.replace(/^Bearer\s+/, "").trim();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ success: false, message: "Invalid or expired token", error: { code: "INVALID_TOKEN" } });
    const { data: profile, error: profileError } = await supabase.from("profiles").select("id,email,account_type,full_name,username,headline,bio,location,website,phone,avatar_url,cover_image_url,resume_path,created_at,updated_at").eq("id", user.id).single();
    if (profileError || !profile) return res.status(404).json({ success: false, message: "Profile not found", error: { code: "PROFILE_NOT_FOUND" } });
    req.auth = { id: user.id, email: user.email, token };
    req.user = profile;
    return next();
  } catch (error) { return next(error); }
};
