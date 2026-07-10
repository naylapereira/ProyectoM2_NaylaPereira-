require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("Conexion con PostgreSQL exitosa");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Error al conectar con PostgreSQL");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();