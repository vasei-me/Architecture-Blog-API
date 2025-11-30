import { Router } from "express";
import { authMiddleware } from "../../shared/middleware/authMiddleware";
import categoryController from "./CategoryController";
// import validate from '../../shared/validation/validate';
// import { createCategorySchema, updateCategorySchema } from '../../shared/validation/categorySchema';

const router = Router();

// Public routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/popular", categoryController.getPopularCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.get("/categories/slug/:slug", categoryController.getCategoryBySlug);

// Protected routes (require authentication - usually for admins)
router.post("/categories", authMiddleware, categoryController.createCategory);
router.put(
  "/categories/:id",
  authMiddleware,
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  authMiddleware,
  categoryController.deleteCategory
);

// New routes for post-category management
router.post(
  "/categories/:id/posts",
  authMiddleware,
  categoryController.addPostToCategory
);
router.delete(
  "/categories/:id/posts",
  authMiddleware,
  categoryController.removePostFromCategory
);

export default router;
