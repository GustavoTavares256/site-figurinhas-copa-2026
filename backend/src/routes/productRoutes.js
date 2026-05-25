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

const router = express.Router();

router.get(
  "/products",
  listProducts
);

router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  storeProduct
);

router.put(
  "/products/:id",
  authMiddleware,
  upload.single("image"),
  editProduct
);

router.delete(
  "/products/:id",
  authMiddleware,
  removeProduct
);

module.exports = router;