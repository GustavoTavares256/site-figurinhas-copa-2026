require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function createAdmin() {
  const name = "Gustavo Admin";
  const email = "emailadmin123@gmail.com";
  const password = "12345678";

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)"
    [name, email, hashedPassword],
    (error) => {
      if (error) {
        console.log("Erro ao criar admin:", error);
        process.exit(1);
      }

      console.log("Admin criado com sucesso!");
      process.exit(0);
    }
  );
}

createAdmin();