require("dotenv").config();

const mysql = require("mysql2/promise");

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
      database: url.pathname.replace("/", "")
    };
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE
  };
}

const dbConfig = getDatabaseConfig();

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  timezone: "Z",
  decimalNumbers: true
});

async function testConnection() {
  const connection = await pool.getConnection();
  connection.release();
  console.log("MySQL conectado com sucesso.");
}

module.exports = pool;
module.exports.testConnection = testConnection;
