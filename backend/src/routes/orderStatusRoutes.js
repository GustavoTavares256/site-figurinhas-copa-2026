const express = require("express");

const {
  changeOrderStatus
} = require("../controllers/orderStatusController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.put(
  "/admin/orders/:id/status",
  authMiddleware,
  changeOrderStatus
);

module.exports = router;