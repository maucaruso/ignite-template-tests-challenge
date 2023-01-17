import request from "supertest";
import { Connection, createConnection } from 'typeorm';

import { app } from "../../../../app";

let connection: Connection;

describe("Create a new Statement", () => {
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

  it("should create a new deposit statement", async () => {
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

    const response = await request(app).post("/api/v1/statements/deposit").send({
      "amount": 100,
      "description": "venda olx"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
  });

  it("should create a new withdraw statement", async () => {
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

    await request(app).post("/api/v1/statements/deposit").send({
      "amount": 100,
      "description": "venda olx"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      "amount": 50,
      "description": "venda olx"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
  });

  it("should not be able to create a new withdraw statement if account hasn't enought balance", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      "amount": 50,
      "description": "venda olx"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
