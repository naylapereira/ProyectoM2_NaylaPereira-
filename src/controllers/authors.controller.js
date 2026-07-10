const authorsService = require("../services/authors.service");

async function getAuthors(req, res) {
  try {
    const authors = await authorsService.getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    console.error("Error al obtener los autores:", error);

    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  getAuthors,
};