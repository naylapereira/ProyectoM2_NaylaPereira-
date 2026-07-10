const express = require("express");

const authorsController = require("../controllers/authors.controller");

const router = express.Router();

router.get("/", authorsController.getAuthors);

module.exports = router;