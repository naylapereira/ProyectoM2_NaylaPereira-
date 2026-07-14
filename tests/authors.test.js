const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/database");

describe("Authors API", () => {
  test("GET /authors debe responder con estado 200", async () => {
    const response = await request(app).get("/authors");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /authors/:id debe devolver 404 si el autor no existe", async () => {
    const response = await request(app).get("/authors/999999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: "Autor no encontrado",
    });
  });

  test("POST /authors debe crear un autor correctamente", async () => {
    const uniqueEmail = `test${Date.now()}@email.com`;

    const response = await request(app)
      .post("/authors")
      .send({
        name: "Autor de prueba",
        email: uniqueEmail,
        bio: "Biografía de prueba",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.name).toBe("Autor de prueba");
    expect(response.body.email).toBe(uniqueEmail);
  });

  test("POST /authors debe devolver 400 si el nombre está vacío", async () => {
    const uniqueEmail = `test${Date.now()}@email.com`;

    const response = await request(app)
      .post("/authors")
      .send({
        name: "",
        email: uniqueEmail,
        bio: "Biografía de prueba",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: "El nombre es obligatorio",
    });
  });

  afterAll(async () => {
    await pool.end();
  });
});