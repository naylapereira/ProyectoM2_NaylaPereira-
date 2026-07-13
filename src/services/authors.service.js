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

async function getAuthorById(id) {
  const query = `
    SELECT id, name, email, bio, created_at
    FROM authors
    WHERE id = $1
  `;

  const values = [id];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function createAuthor(name, email, bio) {
  const query = `
    INSERT INTO authors (name, email, bio)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, bio, created_at
  `;

  const values = [name, email, bio];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function updateAuthor(id, name, email, bio) {
  const query = `
    UPDATE authors
    SET name = $1,
        email = $2,
        bio = $3
    WHERE id = $4
    RETURNING id, name, email, bio, created_at
  `;

  const values = [name, email, bio, id];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function deleteAuthor(id) {
  const query = `
    DELETE FROM authors
    WHERE id = $1
    RETURNING id
  `;

  const values = [id];

  const result = await pool.query(query, values);

  return result.rows[0];
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};