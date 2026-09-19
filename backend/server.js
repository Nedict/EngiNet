require("dotenv").config();
const app = require("./src/app");
const env = require("./src/config/env");

async function start() {
  env.validateEnv();
  app.listen(env.port, () => console.log(`EngiNet API listening on port ${env.port}`));
}

if (require.main === module) start().catch((error) => { console.error(error.message); process.exit(1); });
module.exports = start;
