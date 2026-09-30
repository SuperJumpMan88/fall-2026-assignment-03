import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Authentication", () => {
  it("logs in a user and returns a JWT", async () => {
    // 1. Create a user
    await request(app)
      .post("/users")
      .send({
        username: "connor",
        email: "connor@example.com",
        password: "password123"
      });

    // 2. Login
    const res = await request(app)
      .post("/login")
      .send({
        email: "connor@example.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects invalid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "connor@example.com",
        password: "wrong"
      });

    expect(res.status).toBe(401);
  });
});
