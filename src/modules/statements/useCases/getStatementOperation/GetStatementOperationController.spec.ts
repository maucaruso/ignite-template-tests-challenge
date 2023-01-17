import request from "supertest";
import { Connection, createConnection } from 'typeorm';

import { app } from "../../../../app";

let connection: Connection;

describe("Show Statement", () => {
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

  it("should be able to show a statement by it's id", async () => {
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

    const operation = await request(app).post("/api/v1/statements/deposit").send({
      "amount": 100,
      "description": "venda olx"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const { id } = operation.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
  });

  it("should not be able to show an unexisting statement", async () => {
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

    const response = await request(app).get(`/api/v1/statements/123123-123123`).send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
  });
});
