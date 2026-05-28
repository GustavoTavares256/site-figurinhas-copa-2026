require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./connection");

async function runSqlFile(file) {
  const sql = fs.readFileSync(path.resolve(process.cwd(), "src/database", file), "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function columnExists(table, column) {
  const [rows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [table, column]
  );

  return rows[0].total > 0;
}

async function addColumnIfMissing(table, column, definition) {
  if (await columnExists(table, column)) return;
  await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

async function upgradeLegacyTables() {
  await addColumnIfMissing("products", "sku", "VARCHAR(80) NULL UNIQUE");
  await addColumnIfMissing("products", "image", "VARCHAR(600) NULL");
  await addColumnIfMissing("products", "image_url", "VARCHAR(600) NULL");
  await addColumnIfMissing("products", "is_active", "TINYINT(1) NOT NULL DEFAULT 1");
  await addColumnIfMissing(
    "products",
    "updated_at",
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  if (await columnExists("products", "image")) {
    await pool.query("UPDATE products SET image_url = image WHERE image_url IS NULL AND image IS NOT NULL");
  }

  await addColumnIfMissing("orders", "customer_id", "INT NULL");
  await addColumnIfMissing("orders", "coupon_id", "INT NULL");
  await addColumnIfMissing("orders", "subtotal", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  await addColumnIfMissing("orders", "discount", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  await addColumnIfMissing(
    "orders",
    "updated_at",
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  await addColumnIfMissing("order_items", "product_id", "INT NULL");
  await addColumnIfMissing("order_items", "unit_price", "DECIMAL(10,2) NULL");
  await addColumnIfMissing("order_items", "line_total", "DECIMAL(10,2) NULL");

  if (await columnExists("order_items", "price")) {
    await pool.query("UPDATE order_items SET unit_price = price WHERE unit_price IS NULL");
    await pool.query(
      "UPDATE order_items SET line_total = price * quantity WHERE line_total IS NULL AND price IS NOT NULL"
    );
  }

  await addColumnIfMissing("stock_movements", "order_id", "INT NULL");
}

async function migrate() {
  await runSqlFile("schema.sql");
  await upgradeLegacyTables();
  await runSqlFile("seed.sql");
  console.log("Banco migrado e seed executado.");
  await pool.end();
}

migrate().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
