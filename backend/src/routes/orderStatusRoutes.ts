const express = require("express");

const {
  changeOrderStatus
} = require("../controllers/orderStatusController");

const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.put(
  "/admin/orders/:id/status",
  authMiddleware,
  asyncHandler(changeOrderStatus)
);

module.exports = router;
