function logInfo(message, meta = {}) {
  console.log(JSON.stringify({ level: "info", message, ...meta }));
}

function logError(error, meta = {}) {
  console.error(JSON.stringify({
    level: "error",
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    ...meta
  }));
}

module.exports = {
  logInfo,
  logError
};
