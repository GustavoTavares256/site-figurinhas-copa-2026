const express = require("express");

const {
  listOrders
} = require("../controllers/orderAdminController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/admin/orders",
  authMiddleware,
  listOrders
);

module.exports = router; 