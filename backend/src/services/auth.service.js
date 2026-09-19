const supabase = require("../config/supabase");

function database() {
  if (!supabase) {
    const error = new Error("Database service is not configured");
    error.status = 503;
    error.code = "DATABASE_UNAVAILABLE";
    throw error;
  }
  return supabase;
}

exports.register = async ({ email, password, full_name, account_type }) => {
  const { data, error } = await database().auth.signUp({ email, password, options: { data: { full_name, account_type } } });
  if (error) throw error;
  return { user: data.user ? { id: data.user.id, email: data.user.email } : null, session: data.session };
};

exports.login = async ({ email, password }) => {
  const { data, error } = await database().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user ? { id: data.user.id, email: data.user.email } : null, session: data.session };
};

exports.logout = async () => ({ loggedOut: true });
