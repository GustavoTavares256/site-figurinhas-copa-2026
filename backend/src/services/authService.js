const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../database/connection");

const JWT_SECRET = "segredo_super_secreto";

function createAdmin(name, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      connection.query(
        "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (error, result) => {
          if (error) return reject(error);

          resolve({
            id: result.insertId,
            name,
            email
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function loginAdmin(email, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM admins WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) return reject(error);

        if (results.length === 0) {
          return reject(new Error("Admin não encontrado."));
        }

        const admin = results[0];

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
          return reject(new Error("Senha incorreta."));
        }

        const token = jwt.sign(
          {
            id: admin.id,
            email: admin.email
          },
          JWT_SECRET,
          {
            expiresIn: "1d"
          }
        );

        resolve({
          token,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email
          }
        });
      }
    );
  });
}

module.exports = {
  createAdmin,
  loginAdmin,
  JWT_SECRET
};