require("dotenv").config();

const app = require("./app");
const env = require("./config/env");
const testConnection = require("./config/testConnection");

async function startServer() {
  await testConnection();

  app.listen(env.port, () => {
    console.log(`🚀 EngiNet API running on port ${env.port}`);
  });
}

startServer();
