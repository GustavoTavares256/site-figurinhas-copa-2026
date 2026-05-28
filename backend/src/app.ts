const express = require("express");
const cors = require("cors");
const path = require("path");
const { env } = require("./config/env");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderAdminRoutes = require("./routes/orderAdminRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");
const orderStatusRoutes = require("./routes/orderStatusRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderCrudRoutes = require("./routes/orderCrudRoutes");
const rateLimit = require("./middlewares/rateLimitMiddleware");
const { notFound, errorMiddleware } = require("./middlewares/errorMiddleware");
const { helmetMiddleware, sanitizeBody } = require("./middlewares/securityMiddleware");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmetMiddleware);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origem nao permitida pelo CORS."));
  }
}));

app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 180 }));

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
);

const apiRouter = express.Router();

apiRouter.use(authRoutes);
apiRouter.use(productRoutes);
apiRouter.use(dashboardRoutes);
apiRouter.use(orderAdminRoutes);
apiRouter.use(customerOrderRoutes);
apiRouter.use(orderStatusRoutes);
apiRouter.use(orderRoutes);
apiRouter.use(orderCrudRoutes);

app.use("/api", apiRouter);

// Legacy aliases kept for older static deployments.
app.use(authRoutes);
app.use(productRoutes);
app.use(dashboardRoutes);
app.use(orderAdminRoutes);
app.use(customerOrderRoutes);
app.use(orderStatusRoutes);
app.use(orderRoutes);
app.use(orderCrudRoutes);

app.get("/", (req, res) => {
  return res.json({
    name: "Copa Stickers API",
    status: "ok",
    version: "1.0.0"
  });
});

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
