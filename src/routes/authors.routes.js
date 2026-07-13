const express = require("express");

const authorsController = require("../controllers/authors.controller");

const router = express.Router();

router.get("/", authorsController.getAllAuthors);

router.get("/:id", authorsController.getAuthorById);

router.post("/", authorsController.createAuthor);

router.put("/:id", authorsController.updateAuthor);

router.delete("/:id", authorsController.deleteAuthor);

module.exports = router;