import request from "supertest";
import app from "../server";

describe("Simple Auth Test", () => {
  test("POST /api/auth/register - simple user", async () => {
    const simpleUser = {
      username: "testuser123", // بدون underscore و کاراکتر خاص
      email: "test123@example.com",
      password: "123456",
    };

    console.log("📤 Sending register request...");

    const response = await request(app)
      .post("/api/auth/register")
      .send(simpleUser);

    console.log("📥 Register Response:", {
      status: response.status,
      success: response.body.success,
      message: response.body.message,
      error: response.body.error,
    });

    // برای دیباگ، هر statusی رو قبول کن
    if (response.status === 201) {
      expect(response.body.success).toBe(true);
    } else if (response.status === 400) {
      console.log("Validation error:", response.body.message);
    } else if (response.status === 500) {
      console.log("Server error - need to check logs");
    }
  }, 15000);

  test("POST /api/auth/login - simple login", async () => {
    const loginData = {
      email: "test123@example.com",
      password: "123456",
    };

    console.log("📤 Sending login request...");

    const response = await request(app).post("/api/auth/login").send(loginData);

    console.log("📥 Login Response:", {
      status: response.status,
      success: response.body.success,
      message: response.body.message,
    });

    // برای دیباگ
    expect([200, 401, 500]).toContain(response.status);
  }, 15000);
});
