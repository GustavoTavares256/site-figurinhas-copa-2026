const express = require("express");

const {
  checkout
} = require("../controllers/orderController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/checkout", asyncHandler(checkout));

module.exports = router;
