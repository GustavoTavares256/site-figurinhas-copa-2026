const helmet = require("helmet");

function sanitizeValue(value) {
  if (typeof value === "string") {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)])
    );
  }

  return value;
}

function sanitizeBody(req, res, next) {
  if (req.body && !(req.body instanceof Buffer)) {
    req.body = sanitizeValue(req.body);
  }

  return next();
}

const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  }
});

module.exports = {
  helmetMiddleware,
  sanitizeBody
};
