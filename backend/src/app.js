const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderAdminRoutes = require("./routes/orderAdminRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");
const orderStatusRoutes = require("./routes/orderStatusRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderCrudRoutes = require("./routes/orderCrudRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.resolve(__dirname, "../../uploads")
  )
);

/* ROTAS */

app.use(authRoutes);

app.use(productRoutes);

app.use(dashboardRoutes);

app.use(orderAdminRoutes);

app.use(customerOrderRoutes);

app.use(orderStatusRoutes);

app.use(orderRoutes);

app.use(orderCrudRoutes);

/* ROOT */

app.get("/", (req, res) => {

  return res.json({
    message: "API rodando com sucesso!"
  });

});

module.exports = app;