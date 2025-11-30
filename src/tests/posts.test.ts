import request from "supertest";
import app from "../server";

describe("Posts API", () => {
  let token: string;
  let testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: "123456",
  };

  beforeAll(async () => {
    // اول کاربر جدید ثبت‌نام کن
    await request(app).post("/api/auth/register").send(testUser);

    // سپس لاگین کن تا توکن بگیریم
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    token = loginResponse.body.data.token;
  });

  test("POST /api/posts - should create post", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content:
          "This is a test post content with enough characters to pass validation",
        tags: ["test"],
      });

    console.log("Create Post Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.post.title).toBe("Test Post");
  });

  test("GET /api/posts - should get all posts", async () => {
    const response = await request(app).get("/api/posts");

    console.log("Get Posts Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.posts)).toBe(true);
  });

  test("GET /api/me/posts - should get user posts", async () => {
    const response = await request(app)
      .get("/api/me/posts")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get My Posts Response:", {
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.posts)).toBe(true);
  });
});
