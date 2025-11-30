import { Router } from "express";
import { authMiddleware } from "../../shared/middleware/authMiddleware";
import {
  loginSchema,
  registerSchema,
} from "../../shared/validation/authSchema";
import validate from "../../shared/validation/validate";
import authController from "./AuthController";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);

export default router;
