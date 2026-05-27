const connection = require("../database/connection");

function getAllProducts() {
  return new Promise((resolve, reject) => {
    connection.query(
      `
        SELECT
          id,
          name,
          description,
          price,
          category,
          icon,
          stock,
          image,
          created_at
        FROM products
        ORDER BY id DESC
      `,
      (error, results) => {
        if (error) {
          console.log("ERRO SQL getAllProducts:", error);
          return reject(error);
        }

        resolve(results);
      }
    );
  });
}

function createProduct(product) {
  return new Promise((resolve, reject) => {
    const {
      name,
      description,
      price,
      category,
      icon,
      stock,
      image
    } = product;

    connection.query(
      `
        INSERT INTO products
        (
          name,
          description,
          price,
          category,
          icon,
          stock,
          image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        description,
        price,
        category,
        icon,
        stock,
        image
      ],
      (error, result) => {
        if (error) {
          console.log("ERRO SQL createProduct:", error);
          return reject(error);
        }

        resolve({
          id: result.insertId,
          name,
          description,
          price,
          category,
          icon,
          stock,
          image
        });
      }
    );
  });
}

function updateProduct(id, product) {
  return new Promise((resolve, reject) => {
    const {
      name,
      description,
      price,
      category,
      icon,
      stock,
      image
    } = product;

    connection.query(
      `
        UPDATE products
        SET
          name = ?,
          description = ?,
          price = ?,
          category = ?,
          icon = ?,
          stock = ?,
          image = ?
        WHERE id = ?
      `,
      [
        name,
        description,
        price,
        category,
        icon,
        stock,
        image,
        id
      ],
      (error) => {
        if (error) {
          console.log("ERRO SQL updateProduct:", error);
          return reject(error);
        }

        resolve({
          id,
          name,
          description,
          price,
          category,
          icon,
          stock,
          image
        });
      }
    );
  });
}

function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM products WHERE id = ?",
      [id],
      (error) => {
        if (error) {
          console.log("ERRO SQL deleteProduct:", error);
          return reject(error);
        }

        resolve({
          message: "Produto deletado com sucesso."
        });
      }
    );
  });
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};