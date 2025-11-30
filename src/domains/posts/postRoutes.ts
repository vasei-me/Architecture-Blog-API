import { Router } from "express";
import { authMiddleware } from "../../shared/middleware/authMiddleware";
import postController from "./PostController";
// import validate from '../../shared/validation/validate';
// import { createPostSchema, updatePostSchema } from '../../shared/validation/postSchema';

const router = Router();

// Public routes
router.get("/posts", postController.getPosts);
router.get("/posts/:id", postController.getPost);

// Protected routes (require authentication)
router.post("/posts", authMiddleware, postController.createPost); // موقتاً والیدیشن رو حذف کردم
router.put("/posts/:id", authMiddleware, postController.updatePost);
router.delete("/posts/:id", authMiddleware, postController.deletePost);
router.get("/me/posts", authMiddleware, postController.getMyPosts);
router.get("/users/:userId/posts", authMiddleware, postController.getUserPosts);

export default router;
