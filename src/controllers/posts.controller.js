const postsService = require("../services/posts.service");
const authorsService = require("../services/authors.service");

async function getAllPosts(req, res) {
  try {
    const posts = await postsService.getAllPosts();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function getPostById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: "Publicación no encontrada",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error al obtener la publicación:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function getPostsByAuthorId(req, res) {
  try {
    const authorId = Number(req.params.authorId);

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({
        error: "El ID del autor debe ser un número válido",
      });
    }

    const posts = await postsService.getPostsByAuthorId(authorId);

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener las publicaciones del autor:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function createPost(req, res) {
  try {
    const { author_id, title, content, published } = req.body;

    const authorId = Number(author_id);

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({
        error: "El ID del autor debe ser un número válido",
      });
    }

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "El título es obligatorio",
      });
    }

    if (typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({
        error: "El contenido es obligatorio",
      });
    }

    if (
      published !== undefined &&
      typeof published !== "boolean"
    ) {
      return res.status(400).json({
        error: "El campo published debe ser true o false",
      });
    }

    const author = await authorsService.getAuthorById(authorId);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanPublished =
      published === undefined ? false : published;

    const newPost = await postsService.createPost(
      authorId,
      cleanTitle,
      cleanContent,
      cleanPublished
    );

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error al crear la publicación:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function updatePost(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const { author_id, title, content, published } = req.body;

    const authorId = Number(author_id);

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({
        error: "El ID del autor debe ser un número válido",
      });
    }

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "El título es obligatorio",
      });
    }

    if (typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({
        error: "El contenido es obligatorio",
      });
    }

    if (typeof published !== "boolean") {
      return res.status(400).json({
        error: "El campo published debe ser true o false",
      });
    }

    const author = await authorsService.getAuthorById(authorId);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    const updatedPost = await postsService.updatePost(
      id,
      authorId,
      cleanTitle,
      cleanContent,
      published
    );

    if (!updatedPost) {
      return res.status(404).json({
        error: "Publicación no encontrada",
      });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error al actualizar la publicación:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function deletePost(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const deletedPost = await postsService.deletePost(id);

    if (!deletedPost) {
      return res.status(404).json({
        error: "Publicación no encontrada",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
};