const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { JWT_SECRET } = require("../services/authService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token nao enviado.", 401, "TOKEN_REQUIRED"));
  }

  try {
    req.admin = jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET);
    return next();
  } catch (error) {
    return next(new AppError("Token invalido.", 401, "INVALID_TOKEN"));
  }
}

module.exports = authMiddleware;
