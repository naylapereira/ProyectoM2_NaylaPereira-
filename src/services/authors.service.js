const pool = require("../config/database");

async function getAllAuthors() {
  const query = `
    SELECT id, name, email, bio, created_at
    FROM authors
    ORDER BY id ASC
  `;

  const result = await pool.query(query);

  return result.rows;
}

module.exports = {
  getAllAuthors,
};