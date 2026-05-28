const connection = require("../database/connection");

async function countAdmins() {
  const [rows] = await connection.execute("SELECT COUNT(*) AS total FROM admins");
  return Number(rows[0]?.total || 0);
}

module.exports = {
  countAdmins
};
