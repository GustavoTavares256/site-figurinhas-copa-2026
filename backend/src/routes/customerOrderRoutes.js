const express = require("express");

const {
  listCustomerOrders
} = require("../controllers/customerOrderController");

const router = express.Router();

router.get("/orders/customer/:phone", listCustomerOrders);

module.exports = router;