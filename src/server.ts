import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import config from "./config";

// Import routes
import authRoutes from "./domains/auth/authRoutes";
import categoryRoutes from "./domains/categories/categoryRoutes";
import commentRoutes from "./domains/comments/commentRoutes";
import postRoutes from "./domains/posts/postRoutes";
import { errorMiddleware } from "./shared/middleware/errorMiddleware";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", categoryRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error middleware
app.use(errorMiddleware);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server - فقط در محیط غیر تست اجرا بشه
const startServer = async () => {
  await connectDB();

  // اگر محیط تست نیست، سرور رو اجرا کن
  if (process.env.NODE_ENV !== "test") {
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("📝 Available endpoints:");
      console.log("   GET  /api/health");
      console.log("   POST /api/auth/register");
      console.log("   POST /api/auth/login");
      console.log("   GET  /api/auth/profile");
      console.log("   GET  /api/posts");
      console.log("   POST /api/posts");
      console.log("   GET  /api/posts/:id");
      console.log("   PUT  /api/posts/:id");
      console.log("   DEL  /api/posts/:id");
      console.log("   GET  /api/me/posts");
      console.log("   GET  /api/posts/:postId/comments");
      console.log("   POST /api/comments");
      console.log("   PUT  /api/comments/:id");
      console.log("   DEL  /api/comments/:id");
      console.log("   POST /api/comments/:id/like");
      console.log("   GET  /api/me/comments");
      console.log("   GET  /api/categories");
      console.log("   POST /api/categories");
      console.log("   GET  /api/categories/popular");
      console.log("   GET  /api/categories/:id");
      console.log("   GET  /api/categories/slug/:slug");
      console.log("   PUT  /api/categories/:id");
      console.log("   DEL  /api/categories/:id");
    });

    return server;
  }

  return app;
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log("❌ Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// فقط اگر فایل مستقیماً اجرا شده (نه در تست) و محیط تست نیست
if (require.main === module && process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
