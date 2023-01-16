import request from "supertest";
import { Connection, createConnection } from 'typeorm';

import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
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

  it("Should be able to create a new user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      "name": "test",
      "email": "test@test.com",
      "password": "12345678"
    });

    expect(user.status).toBe(201);
  });

  it("Should not be able to create a new user with an existing email", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "test",
      "email": "test@test.com",
      "password": "12345678"
    });

    const response = await request(app).post("/api/v1/users").send({
      "name": "test",
      "email": "test@test.com",
      "password": "12345678"
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
