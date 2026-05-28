const {
  createAdmin,
  loginAdmin,
  refreshAdminToken
} = require("../services/authService");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");
const { countAdmins } = require("../repositories/adminRepository");

async function register(req, res) {
  const existingAdmins = await countAdmins();
  const setupKey = req.headers["x-admin-setup-key"];

  if (env.isProduction || existingAdmins > 0) {
    if (!env.adminSetupKey || setupKey !== env.adminSetupKey) {
      throw new AppError("Cadastro de admin nao autorizado.", 403, "ADMIN_REGISTRATION_LOCKED");
    }
  }

  const { name, email, password } = req.body;
  const admin = await createAdmin(name, email, password);

  return res.status(201).json({
    message: "Admin criado com sucesso.",
    admin
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const data = await loginAdmin(email, password);

  return res.status(200).json(data);
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  const data = refreshAdminToken(refreshToken);

  return res.status(200).json(data);
}

module.exports = {
  register,
  login,
  refresh
};
