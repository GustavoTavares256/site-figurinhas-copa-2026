const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../services/productService");

async function listProducts(req, res) {
  try {
    const products = await getAllProducts();

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao buscar produtos."
    });
  }
}

async function storeProduct(req, res) {
  try {
    console.log("Arquivo recebido:", req.file);

    const image = req.file ? req.file.filename : null;

    const product = await createProduct({
      ...req.body,
      image
    });

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao criar produto."
    });
  }
}

async function editProduct(req, res) {
  try {
    const { id } = req.params;

    console.log("Arquivo recebido no update:", req.file);

    const image = req.file ? req.file.filename : req.body.image;

    const product = await updateProduct(id, {
      ...req.body,
      image
    });

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao atualizar produto."
    });
  }
}

async function removeProduct(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteProduct(id);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao deletar produto."
    });
  }
}

module.exports = {
  listProducts,
  storeProduct,
  editProduct,
  removeProduct
};