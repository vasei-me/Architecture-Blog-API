import mongoose from "mongoose";
import config from "../config";

describe("Database Connection", () => {
  test("should connect to MongoDB", async () => {
    try {
      await mongoose.connect(config.database.url);
      expect(mongoose.connection.readyState).toBe(1); // connected
      await mongoose.connection.close();
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }, 30000); // timeout 30 ثانیه
});
