import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";

// تنظیمات
// در پروژه‌های واقعی، از کتابخانه 'dotenv' برای خواندن این مقادیر استفاده کنید.
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogdb";
const PORT = 3000;

const connectDB = async () => {
  try {
    // توصیه می‌شود از گزینه 'useNewUrlParser' و 'useUnifiedTopology' استفاده نکنید، زیرا در نسخه‌های جدید Mongoose پیش‌فرض هستند.
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    // پیام خطا را ساده‌تر و صریح‌تر چاپ می‌کنیم تا از خروج پنهان جلوگیری شود.
    console.error(
      "❌ MongoDB connection failed. Please ensure your MongoDB service is running."
    );
    console.error("Details:", error);

    // خروج از برنامه در صورت عدم اتصال
    process.exit(1);
  }
};

const app = express();

// Middlewareها
app.use(express.json());

// تعریف مسیرهای API
app.use("/posts", postRoutes);

// -------------------------------------------------------------------
// راه‌اندازی برنامه
// -------------------------------------------------------------------

// ابتدا به دیتابیس متصل می‌شویم و سپس سرور را اجرا می‌کنیم.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
