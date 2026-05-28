const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../services/productService");

async function listProducts(req, res) {
  const products = await getAllProducts(req.query);
  return res.status(200).json(products);
}

async function storeProduct(req, res) {
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
  const product = await createProduct({ ...req.body, image_url: image });

  return res.status(201).json(product);
}

async function editProduct(req, res) {
  const image = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image_url || req.body.image;

  const product = await updateProduct(req.params.id, {
    ...req.body,
    image_url: image
  });

  return res.status(200).json(product);
}

async function removeProduct(req, res) {
  const result = await deleteProduct(req.params.id);
  return res.status(200).json(result);
}

module.exports = {
  listProducts,
  storeProduct,
  editProduct,
  removeProduct
};
