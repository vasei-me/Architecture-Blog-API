import request from "supertest";
import app from "../server";

describe("Health Check API", () => {
  test("GET /api/health - should return server status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Server is running smoothly");
    expect(response.body).toHaveProperty("timestamp");
  });

  test("GET /api/health - should have correct response structure", async () => {
    const response = await request(app).get("/api/health");

    expect(response.body).toMatchObject({
      success: true,
      message: expect.any(String),
      timestamp: expect.any(String),
    });
  });
});
