require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.log("Erro ao conectar no MySQL");
    console.log(error);
    return;
  }

  console.log("MySQL conectado com sucesso!");
});

module.exports = connection;