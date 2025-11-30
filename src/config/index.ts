import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  database: {
    url:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL ||
          "mongodb://localhost:27017/slogging-blog-test"
        : process.env.DATABASE_URL || "mongodb://localhost:27017/slogging-blog",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-here",
    expiresIn: "24h",
  },
  bcrypt: {
    saltRounds: 10,
  },
};
