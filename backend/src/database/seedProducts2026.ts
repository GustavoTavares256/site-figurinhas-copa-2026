require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./connection");

function parseProducts(sql) {
  const valuesBlock = sql.match(/VALUES\s+([\s\S]+);/i)[1];
  const rows = [];
  const regex = /\('((?:[^']|'')*)', '((?:[^']|'')*)', ([0-9.]+), '([^']+)', '([^']+)', ([0-9]+), '([^']+)'\)/g;
  let match;

  while ((match = regex.exec(valuesBlock))) {
    rows.push({
      name: match[1].replace(/''/g, "'"),
      description: match[2].replace(/''/g, "'"),
      price: Number(match[3]),
      category: match[4],
      icon: match[5],
      stock: Number(match[6]),
      image: match[7]
    });
  }

  return rows;
}

async function seedProducts() {
  const sql = fs.readFileSync(
    path.resolve(process.cwd(), "src/database", "products-2026-catalog.sql"),
    "utf8"
  );
  const products = parseProducts(sql);

  for (const product of products) {
    const [existing] = await pool.execute(
      "SELECT id FROM products WHERE name = ? LIMIT 1",
      [product.name]
    );

    if (existing.length > 0) {
      await pool.execute(
        `
          UPDATE products
          SET description = ?, price = ?, category = ?, icon = ?, stock = ?, image = ?
          WHERE id = ?
        `,
        [
          product.description,
          product.price,
          product.category,
          product.icon,
          product.stock,
          product.image,
          existing[0].id
        ]
      );
    } else {
      await pool.execute(
        `
          INSERT INTO products (name, description, price, category, icon, stock, image)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.name,
          product.description,
          product.price,
          product.category,
          product.icon,
          product.stock,
          product.image
        ]
      );
    }
  }

  console.log(`${products.length} produtos Copa 2026 inseridos/atualizados.`);
  await pool.end();
}

seedProducts().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
