require("dotenv").config();

function parseList(value?: string) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const isProduction = process.env.NODE_ENV === "production";
const localOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

const allowedOrigins = [
  ...parseList(process.env.CORS_ORIGIN),
  ...parseList(process.env.FRONTEND_URL),
  ...(isProduction ? [] : localOrigins)
];

function getJwtSecret(name: "JWT_SECRET" | "JWT_REFRESH_SECRET", fallback: string) {
  const value = process.env[name];

  if (isProduction && !value) {
    throw new Error(`${name} precisa estar configurado em producao.`);
  }

  return value || fallback;
}

module.exports = {
  env: {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    port: Number(process.env.PORT || 3000),
    allowedOrigins,
    jwtSecret: getJwtSecret("JWT_SECRET", "troque_este_segredo_em_desenvolvimento"),
    jwtRefreshSecret: getJwtSecret("JWT_REFRESH_SECRET", `${process.env.JWT_SECRET || "dev"}_refresh`),
    adminSetupKey: process.env.ADMIN_SETUP_KEY || ""
  }
};
