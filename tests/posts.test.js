const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/database");

describe("Posts API", () => {
  test("GET /posts debe responder con estado 200 y devolver un array", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /posts/:id debe devolver 404 si la publicación no existe", async () => {
    const response = await request(app).get("/posts/999999");

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      error: "Publicación no encontrada",
    });
  });

  test("POST /posts debe crear una publicación correctamente", async () => {
    const response = await request(app)
      .post("/posts")
      .send({
        author_id: 5,
        title: "Post de prueba",
        content: "Este es un contenido de prueba",
        published: true,
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.title).toBe("Post de prueba");
    expect(response.body.content).toBe("Este es un contenido de prueba");
    expect(response.body.published).toBe(true);
  });

  test("POST /posts debe devolver 400 si el título está vacío", async () => {
    const response = await request(app)
      .post("/posts")
      .send({
        author_id: 5,
        title: "",
        content: "Contenido de prueba",
        published: true,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: "El título es obligatorio",
    });
  });

  afterAll(async () => {
    await pool.end();
  });
});