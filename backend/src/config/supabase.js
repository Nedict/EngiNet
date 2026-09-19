const { createClient } = require("@supabase/supabase-js");
const env = require("./env");
module.exports = env.supabaseUrl && env.supabaseServiceRoleKey ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } }) : null;
