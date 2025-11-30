import mongoose from "mongoose";
import config from "../config";

// قبل از اجرای همه تست‌ها
export default async () => {
  // اتصال به دیتابیس تست
  await mongoose.connect(config.database.url);
  console.log("🔗 Connected to test database");
};
