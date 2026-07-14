const express = require("express");

const authorsRoutes = require("./routes/authors.routes");
const postsRoutes = require("./routes/posts.routes");

const {
  swaggerUi,
  swaggerDocument,
} = require("./swagger");

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({
    message: "API MiniBlog funcionando",
  });
});

app.use("/authors", authorsRoutes);

app.use("/posts", postsRoutes);

module.exports = app;