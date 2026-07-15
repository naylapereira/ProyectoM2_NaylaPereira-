const authorsService = require("../services/authors.service");

async function getAllAuthors(req, res) {
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

async function getAuthorById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error("Error al obtener el autor:", error);

    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function createAuthor(req, res) {
  try {

    const allowedFields = ["name", "email", "bio"];
    const receivedFields = Object.keys(req.body || {});
    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `Los siguientes campos no son válidos: ${invalidFields.join(", ")}`,
      });
    }
    const { name, email, bio } = req.body;

    let cleanEmail;

    if (typeof email === "string" && email.trim() !== "") {
      cleanEmail = email.trim().toLowerCase();

      const existingAuthor =
        await authorsService.getAuthorByEmail(cleanEmail);

      if (existingAuthor) {
        return res.status(400).json({
          error: "Ya existe un autor con ese email",
        });
      }
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        error: "El email es obligatorio",
      });
    }

    const emailFormat =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailFormat.test(cleanEmail)) {
      return res.status(400).json({
        error: "El email no tiene un formato válido",
      });
    }

    const cleanName = name.trim();

    let cleanBio = null;

    if (typeof bio === "string" && bio.trim() !== "") {
      cleanBio = bio.trim();
    }

    const newAuthor = await authorsService.createAuthor(
      cleanName,
      cleanEmail,
      cleanBio
    );

    return res.status(201).json(newAuthor);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe un autor con ese email",
      });
    }

    console.error("Error al crear el autor:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function updateAuthor(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const { name, email, bio } = req.body;

    if (
      name === undefined &&
      email === undefined &&
      bio === undefined
    ) {
      return res.status(400).json({
        error: "Debes enviar al menos un campo para actualizar",
      });
    }

    const fieldsToUpdate = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
          error: "El nombre debe ser un texto válido",
        });
      }

      fieldsToUpdate.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({
          error: "El email debe ser un texto válido",
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailFormat =
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailFormat.test(cleanEmail)) {
        return res.status(400).json({
          error: "El email no tiene un formato válido",
        });
      }

      fieldsToUpdate.email = cleanEmail;
    }

    if (bio !== undefined) {
      if (bio === null) {
        fieldsToUpdate.bio = null;
      } else if (typeof bio !== "string") {
        return res.status(400).json({
          error: "La biografía debe ser un texto o null",
        });
      } else {
        fieldsToUpdate.bio =
          bio.trim() === "" ? null : bio.trim();
      }
    }

    const updatedAuthor = await authorsService.updateAuthor(
      id,
      fieldsToUpdate
    );

    if (!updatedAuthor) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe un autor con ese email",
      });
    }

    console.error("Error al actualizar el autor:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function deleteAuthor(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número válido",
      });
    }

    const deletedAuthor = await authorsService.deleteAuthor(id);

    if (!deletedAuthor) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el autor:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};