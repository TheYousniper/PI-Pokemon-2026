
const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../config/db");

describe("Pruebas de rutas del backend Pokémon", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /", () => {
    test("Debe responder que el servidor funciona correctamente", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toBe(
        "Servidor Pokémon funcionando correctamente"
      );
    });
  });

  describe("GET /types", () => {
    test("Debe devolver los tipos Pokémon", async () => {
      const response = await request(app).get("/types");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
    });
  });
});

