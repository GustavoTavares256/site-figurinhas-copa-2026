const connection = require("../database/connection");
const AppError = require("../utils/AppError");
const { assertRequired, toMoney } = require("../utils/validators");

type ProductFilters = {
  search?: string;
  category?: string;
};

function normalizeProductPayload(payload) {
  assertRequired(payload.name, "name");
  assertRequired(payload.price, "price");

  return {
    name: String(payload.name).trim(),
    description: String(payload.description || "").trim(),
    price: toMoney(payload.price),
    category: String(payload.category || "pacotes").trim().toLowerCase(),
    icon: String(payload.icon || "PACK").trim(),
    stock: Math.max(0, Number.parseInt(payload.stock || 0, 10)),
    image: payload.image || payload.image_url || null,
    image_url: payload.image_url || payload.image || null,
    sku: payload.sku || null,
    is_active: payload.is_active === undefined ? 1 : Number(Boolean(payload.is_active))
  };
}

async function getAllProducts(filters: ProductFilters = {}) {
  const params = [];
  const clauses = ["is_active = 1"];

  if (filters.search) {
    clauses.push("(name LIKE ? OR description LIKE ? OR category LIKE ? OR sku LIKE ?)");
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  if (filters.category && filters.category !== "all") {
    clauses.push("category = ?");
    params.push(filters.category);
  }

  const [rows] = await connection.execute(
    `
      SELECT id, sku, name, description, price, category, icon, stock,
        COALESCE(image_url, image) AS image, is_active, created_at, updated_at
      FROM products
      WHERE ${clauses.join(" AND ")}
      ORDER BY created_at DESC, id DESC
    `,
    params
  );

  return rows;
}

async function getProductById(id) {
  const [rows] = await connection.execute(
    `
      SELECT id, sku, name, description, price, category, icon, stock,
        COALESCE(image_url, image) AS image, is_active, created_at, updated_at
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError("Produto nao encontrado.", 404, "PRODUCT_NOT_FOUND");
  }

  return rows[0];
}

async function createProduct(payload) {
  const product = normalizeProductPayload(payload);

  const [result] = await connection.execute(
    `
      INSERT INTO products
        (sku, name, description, price, category, icon, stock, image, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      product.sku,
      product.name,
      product.description,
      product.price,
      product.category,
      product.icon,
      product.stock,
      product.image,
      product.image_url,
      product.is_active
    ]
  );

  return getProductById(result.insertId);
}

async function updateProduct(id, payload) {
  const existingProduct = await getProductById(id);

  const product = normalizeProductPayload(payload);
  const image = product.image || existingProduct.image || null;

  await connection.execute(
    `
      UPDATE products
      SET sku = ?, name = ?, description = ?, price = ?, category = ?,
        icon = ?, stock = ?, image = ?, image_url = ?, is_active = ?
      WHERE id = ?
    `,
    [
      product.sku,
      product.name,
      product.description,
      product.price,
      product.category,
      product.icon,
      product.stock,
      image,
      image,
      product.is_active,
      id
    ]
  );

  return getProductById(id);
}

async function deleteProduct(id) {
  await getProductById(id);

  await connection.execute(
    "UPDATE products SET is_active = 0 WHERE id = ?",
    [id]
  );

  return {
    message: "Produto removido com sucesso."
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
