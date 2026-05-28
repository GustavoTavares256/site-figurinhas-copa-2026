const buckets = new Map();
let lastCleanup = Date.now();

type RateLimitOptions = {
  windowMs?: number;
  limit?: number;
};

function rateLimit(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const limit = options.limit || 120;

  return (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    if (now - lastCleanup > windowMs) {
      for (const [bucketKey, bucketValue] of buckets.entries()) {
        if (bucketValue.resetAt <= now) {
          buckets.delete(bucketKey);
        }
      }

      lastCleanup = now;
    }

    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > limit) {
      return res.status(429).json({
        message: "Muitas requisicoes. Tente novamente em alguns minutos.",
        code: "RATE_LIMIT_EXCEEDED"
      });
    }

    return next();
  };
}

module.exports = rateLimit;
