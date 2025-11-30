import request from "supertest";
import app from "../server";

describe("Simple Health Test", () => {
  test("GET /api/health - should return 200", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  }, 10000);
});
