const app = require("./src/app");
const config = require("./src/config/app.config");

app.listen(config.port, config.host, () => {
  console.log(`\n${config.name} v${config.version}`);
  console.log(`Running at ${config.baseUrl}`);
  console.log(`\nSeed accounts:`);
  console.log(`  dev@example.com  / ${config.seed.password}`);
  console.log(`  test@example.com / ${config.seed.password}`);
  console.log(`\nDocs:       GET ${config.baseUrl}/`);
  console.log(`Statuses:   GET ${config.baseUrl}/status/422\n`);
});
