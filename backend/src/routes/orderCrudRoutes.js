const express = require("express");

const {
  removeOrder
} = require("../controllers/orderCrudController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.delete(
  "/admin/orders/:id",
  authMiddleware,
  removeOrder
);

module.exports = router;