import mongoose from "mongoose";
import config from "../config";

describe("Database Connection", () => {
  test("should connect to database", async () => {
    try {
      console.log("Testing database connection...");
      console.log("Database URL:", config.database.url);

      // Try to connect
      await mongoose.connect(config.database.url, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ Database connection successful");

      // Check connection state
      console.log("Connection ready state:", mongoose.connection.readyState);

      // Close connection
      await mongoose.connection.close();
      console.log("✅ Database connection closed");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  });
});
