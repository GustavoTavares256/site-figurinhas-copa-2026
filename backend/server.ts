require("dotenv").config();

const app = require("./src/app");
const { testConnection } = require("./src/database/connection");
const { env } = require("./src/config/env");

const PORT = env.port;

async function bootstrap() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar API:", error);
  process.exit(1);
});
