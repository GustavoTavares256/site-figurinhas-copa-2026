const express = require("express");

const {
  removeOrder
} = require("../controllers/orderCrudController");

const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.delete(
  "/admin/orders/:id",
  authMiddleware,
  asyncHandler(removeOrder)
);

module.exports = router;
