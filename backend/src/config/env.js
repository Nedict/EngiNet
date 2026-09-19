const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
function validateEnv({ requireSupabase = true } = {}) {
  const missing = requireSupabase ? required.filter((key) => !process.env[key]) : [];
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
module.exports = {
  port: Number(process.env.PORT || 5000), nodeEnv: process.env.NODE_ENV || "development", clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  supabaseUrl: process.env.SUPABASE_URL, supabaseAnonKey: process.env.SUPABASE_ANON_KEY, supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, jwtSecret: process.env.JWT_SECRET, validateEnv
};
