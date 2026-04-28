import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

describe("GET /api/v1/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /unknown-route", () => {
  it("returns 404", async () => {
    const res = await request(app).get("/not-a-real-route");
    expect(res.status).toBe(404);
  });
});
