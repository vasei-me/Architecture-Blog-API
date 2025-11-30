import mongoose from "mongoose";
import config from "../config";

export default async () => {
  try {
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Disable mongoose buffering globally
    mongoose.set("bufferCommands", false);

    await mongoose.connect(config.database.url, {
      serverSelectionTimeoutMS: 30000, // Increased timeout for tests
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable mongoose buffering
    });

    // Wait for connection to be fully ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Database connection timeout"));
      }, 30000);

      if (mongoose.connection.readyState === 1) {
        clearTimeout(timeout);
        resolve(true);
      } else {
        mongoose.connection.once("connected", () => {
          clearTimeout(timeout);
          console.log("✅ Mongoose fully connected to test database");
          resolve(true);
        });

        mongoose.connection.once("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      }
    });

    console.log("🔗 Connected to test database");
  } catch (error) {
    console.error("❌ Test database connection failed:", error);
    throw error;
  }
};
