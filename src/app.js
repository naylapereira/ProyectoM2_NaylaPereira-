const express = require("express");

const authorsRoutes = require("./routes/authors.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API MiniBlog funcionando",
  });
});

app.use("/authors", authorsRoutes);

module.exports = app;