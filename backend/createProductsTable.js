require("dotenv").config();

const connection = require("./src/database/connection");

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    icon VARCHAR(20),
    stock INT DEFAULT 0,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const insertProductsSQL = `
  INSERT INTO products
  (name, description, price, category, icon, stock, image)
  VALUES
  ('Seleção Brasil', 'Figurinhas especiais da Seleção Brasileira.', 39.90, 'selecoes', 'BR', 12, NULL),
  ('Seleção Argentina', 'Pacote especial da Seleção Argentina.', 44.90, 'selecoes', 'AR', 8, NULL),
  ('Pacote Premium', 'Pacote com figurinhas variadas da Copa 2026.', 19.90, 'pacotes', 'BOX', 30, NULL),
  ('Neymar Gold', 'Figurinha rara edição Gold.', 89.90, 'raras', 'STAR', 3, NULL),
  ('Messi Black Edition', 'Figurinha lendária edição Black.', 129.90, 'raras', 'FIRE', 2, NULL)
`;

connection.query(createTableSQL, (createError) => {
  if (createError) {
    console.log("Erro ao criar tabela:", createError);
    process.exit(1);
  }

  console.log("Tabela products criada/verificada.");

  connection.query(insertProductsSQL, (insertError) => {
    if (insertError) {
      console.log("Erro ao inserir produtos:", insertError);
      process.exit(1);
    }

    console.log("Produtos inseridos com sucesso!");
    process.exit(0);
  });
});