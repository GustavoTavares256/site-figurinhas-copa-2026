const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "copa_stickers"
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