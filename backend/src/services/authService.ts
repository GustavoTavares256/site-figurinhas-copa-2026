const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../database/connection");
const AppError = require("../utils/AppError");
const { assertRequired } = require("../utils/validators");
const { env } = require("../config/env");

const JWT_SECRET = env.jwtSecret;
const JWT_REFRESH_SECRET = env.jwtRefreshSecret;

function signTokens(admin) {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: "admin"
  };

  return {
    token: jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" })
  };
}

async function createAdmin(name, email, password) {
  assertRequired(name, "name");
  assertRequired(email, "email");
  assertRequired(password, "password");

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await connection.execute(
    "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
    [name.trim(), email.trim().toLowerCase(), hashedPassword]
  );

  return {
    id: result.insertId,
    name,
    email
  };
}

async function loginAdmin(email, password) {
  assertRequired(email, "email");
  assertRequired(password, "password");

  const [results] = await connection.execute(
    "SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1",
    [email.trim().toLowerCase()]
  );

  if (results.length === 0) {
    throw new AppError("Email ou senha invalidos.", 401, "INVALID_CREDENTIALS");
  }

  const admin = results[0];
  const passwordMatch = await bcrypt.compare(password, admin.password_hash);

  if (!passwordMatch) {
    throw new AppError("Email ou senha invalidos.", 401, "INVALID_CREDENTIALS");
  }

  return {
    ...signTokens(admin),
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  };
}

function refreshAdminToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token nao enviado.", 401, "TOKEN_REQUIRED");
  }

  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

  return signTokens(decoded);
}

module.exports = {
  createAdmin,
  loginAdmin,
  refreshAdminToken,
  JWT_SECRET,
  JWT_REFRESH_SECRET
};
