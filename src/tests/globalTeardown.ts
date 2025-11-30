import mongoose from "mongoose";

// بعد از اجرای همه تست‌ها
export default async () => {
  await mongoose.connection.close();
  console.log("🔗 Test database connection closed");
};
