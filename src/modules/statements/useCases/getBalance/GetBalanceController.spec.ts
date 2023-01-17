import request from "supertest";
import { Connection, createConnection } from 'typeorm';

import { app } from "../../../../app";

let connection: Connection;

describe("Get User Account Balance", () => {
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

  it("should return the user balance", async () => {
    const user = {
      "name": "testUser",
      "email": "testuser@test.com",
      "password": "12345678"
    };

    await request(app).post("/api/v1/users").send(user);

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    const { token } = userToken.body;

    const response = await request(app).get("/api/v1/statements/balance").send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });
});
