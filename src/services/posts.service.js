const pool = require("../config/database");

async function getAllPosts() {
  const query = `
    SELECT
      id,
      author_id,
      title,
      content,
      published,
      created_at
    FROM posts
    ORDER BY id ASC
  `;

  const result = await pool.query(query);

  return result.rows;
}

async function getPostById(id) {
  const query = `
    SELECT
      id,
      author_id,
      title,
      content,
      published,
      created_at
    FROM posts
    WHERE id = $1
  `;

  const values = [id];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function getPostsByAuthorId(authorId) {
  const query = `
    SELECT
      id,
      author_id,
      title,
      content,
      published,
      created_at
    FROM posts
    WHERE author_id = $1
    ORDER BY id ASC
  `;

  const values = [authorId];

  const result = await pool.query(query, values);

  return result.rows;
}

async function createPost(authorId, title, content, published) {
  const query = `
    INSERT INTO posts (author_id, title, content, published)
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      author_id,
      title,
      content,
      published,
      created_at
  `;

  const values = [authorId, title, content, published];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function updatePost(id, fieldsToUpdate) {
  const fields = [];
  const values = [];

  Object.entries(fieldsToUpdate).forEach(([field, value]) => {
    values.push(value);
    fields.push(`${field} = $${values.length}`);
  });

  values.push(id);

  const query = `
    UPDATE posts
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING id, author_id, title, content, published, created_at
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function deletePost(id) {
  const query = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING id
  `;

  const values = [id];

  const result = await pool.query(query, values);

  return result.rows[0];
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
};