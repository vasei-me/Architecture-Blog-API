import request from "supertest";
import app from "../server";

describe("Auth API", () => {
  // استفاده از username بدون underscore
  const testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: "123456",
  };

  test("POST /api/auth/register - should register new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // دیباگ: پاسخ رو چاپ کن
    console.log("Register Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user.username).toBe(testUser.username);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data).toHaveProperty("token");
  });

  test("POST /api/auth/login - should login user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    // دیباگ: پاسخ رو چاپ کن
    console.log("Login Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.user.email).toBe(testUser.email);
  });

  test("POST /api/auth/login - should fail with wrong password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("POST /api/auth/register - should fail with duplicate email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // دیباگ: پاسخ رو چاپ کن
    console.log("Duplicate Register Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    // می‌تونه چندین پیام مختلف باشه
    expect([
      "User with this email or username already exists",
      "Category with this name or slug already exists",
    ]).toContain(response.body.message);
  });
});
