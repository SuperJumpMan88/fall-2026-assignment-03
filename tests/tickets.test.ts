import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Tickets", () => {
  it("creates, fetches, updates, and deletes tickets", async () => {
    // 1. Create user
    await request(app)
      .post("/users")
      .send({
        username: "connor",
        email: "connor@example.com",
        password: "password123"
      });

    // 2. Login
    const login = await request(app)
      .post("/login")
      .send({
        email: "connor@example.com",
        password: "password123"
      });

    const token = login.body.token;

    // 3. Create ticket
    const create = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Ticket",
        description: "Testing",
        status: "open"
      });

    expect(create.status).toBe(201);
    const ticketId = create.body.id;

    // 4. Fetch tickets
    const list = await request(app)
      .get("/tickets")
      .set("Authorization", `Bearer ${token}`);

    expect(list.body.length).toBe(1);

    // 5. Update ticket
    const update = await request(app)
      .patch(`/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "closed" });

    expect(update.body.status).toBe("closed");

    // 6. Delete ticket
    const del = await request(app)
      .delete(`/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(del.body.success).toBe(true);
  });
});
