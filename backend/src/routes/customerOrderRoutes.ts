const express = require("express");

const {
  listCustomerOrders
} = require("../controllers/customerOrderController");

const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");

router.get("/orders/customer/:phone", asyncHandler(listCustomerOrders));

module.exports = router;
