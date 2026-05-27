require("dotenv").config();

const connection = require("./src/database/connection");

const sql = `
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  items JSON,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'Pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

connection.query(sql, (error) => {
  if (error) {
    console.log("Erro ao criar orders:", error);
    process.exit(1);
  }

  console.log("Tabela orders criada com sucesso!");
  process.exit(0);
});