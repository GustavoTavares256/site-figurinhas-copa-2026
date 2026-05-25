const express = require("express");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderAdminRoutes = require("./routes/orderAdminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(orderAdminRoutes);

app.use(
  "/uploads",
  express.static(
    path.resolve(__dirname, "../../uploads")
  )
);

app.get("/", (req, res) => {
  return res.json({
    message: "API rodando com sucesso!"
  });
});

app.use(orderRoutes);
app.use(productRoutes);

module.exports = app;