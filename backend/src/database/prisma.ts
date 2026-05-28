import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function getDatabaseConfig() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQL_URL;

  if (databaseUrl) {
    const url = new URL(databaseUrl);

    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace("/", ""),
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
    };
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  };
}

const adapter = new PrismaMariaDb(getDatabaseConfig());

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
export { prisma };
