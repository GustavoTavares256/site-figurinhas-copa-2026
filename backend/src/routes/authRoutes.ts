const express = require("express");

const {
  register,
  login,
  refresh
} = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/refresh", asyncHandler(refresh));

module.exports = router;
