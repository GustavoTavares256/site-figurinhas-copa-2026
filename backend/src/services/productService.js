const connection = require("../database/connection");

function getAllProducts() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
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
          reject(error);
          return;
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
          reject(error);
          return;
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
        if (error) return reject(error);

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