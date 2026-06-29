const supabase = require("./supabase");

async function testConnection() {
  const { error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  if (error) {
    console.error("❌ Supabase connection failed:");
    console.error(error.message);
    return;
  }

  console.log("✅ Successfully connected to Supabase");
}

module.exports = testConnection;
