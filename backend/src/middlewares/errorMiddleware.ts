const AppError = require("../utils/AppError");
const { logError } = require("../utils/logger");

function notFound(req, res, next) {
  next(new AppError("Rota nao encontrada.", 404, "NOT_FOUND"));
}

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  logError(error, {
    method: req.method,
    path: req.originalUrl
  });

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Erro interno do servidor." : error.message,
    code: error.code || "INTERNAL_ERROR"
  });
}

module.exports = {
  notFound,
  errorMiddleware
};
