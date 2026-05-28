const AppError = require("./AppError");

function assertRequired(value, field) {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new AppError(`Campo obrigatorio: ${field}.`, 400, "VALIDATION_ERROR");
  }
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function toMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new AppError("Valor monetario invalido.", 400, "VALIDATION_ERROR");
  }

  return Number(number.toFixed(2));
}

function toPositiveInteger(value, field) {
  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw new AppError(`${field} deve ser um numero inteiro positivo.`, 400, "VALIDATION_ERROR");
  }

  return number;
}

module.exports = {
  assertRequired,
  normalizePhone,
  toMoney,
  toPositiveInteger
};
