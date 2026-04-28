import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

describe("GET /api/v1", () => {
  it("returns 200 with API name and version", async () => {
    const res = await request(app).get("/api/v1/");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "Brand Fidelity AI API",
      version: "0.1.0",
    });
  });
});
