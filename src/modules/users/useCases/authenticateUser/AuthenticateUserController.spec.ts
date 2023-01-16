import request from "supertest";
import { Connection, createConnection } from 'typeorm';

import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async() => {
    connection = await createConnection();
  });

  beforeEach(async() => {
    await connection.runMigrations();
  });

  afterEach(async() => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should be able to authenticate and generate a Token to an existing user", async () => {
    const user = {
      "name": "test",
      "email": "test@test.com",
      "password": "12345678"
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate and generate a Token to an unexisting user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "password"
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
