const express = require("express");

const {
  listProducts,
  storeProduct,
  editProduct,
  removeProduct
} = require("../controllers/productController");

const upload = require("../middlewares/upload");

const authMiddleware = require(
  "../middlewares/authMiddleware"
);
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/products",
  asyncHandler(listProducts)
);

router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  asyncHandler(storeProduct)
);

router.put(
  "/products/:id",
  authMiddleware,
  upload.single("image"),
  asyncHandler(editProduct)
);

router.delete(
  "/products/:id",
  authMiddleware,
  asyncHandler(removeProduct)
);

module.exports = router;
