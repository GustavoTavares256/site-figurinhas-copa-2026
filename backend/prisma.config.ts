import "dotenv/config";
import { defineConfig } from "prisma/config";

function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const port = process.env.DB_PORT || process.env.MYSQLPORT || "3306";
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE;

  if (!host || !user || !database) {
    throw new Error(
      "Configure DATABASE_URL ou DB_HOST, DB_USER e DB_NAME para usar Prisma."
    );
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: buildDatabaseUrl()
  }
});
