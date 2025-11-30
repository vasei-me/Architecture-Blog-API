import { Router } from "express";
import { authMiddleware } from "../../shared/middleware/authMiddleware";
// import { createCommentSchema, updateCommentSchema } from "../../shared/validation/commentSchema";
// import validate from "../../shared/validation/validate";
import commentController from "./CommentController";

const router = Router();

// Public routes
router.get("/posts/:postId/comments", commentController.getPostComments);

// Protected routes (require authentication)
router.post("/comments", authMiddleware, commentController.createComment);
router.put("/comments/:id", authMiddleware, commentController.updateComment);
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);
router.post(
  "/comments/:id/like",
  authMiddleware,
  commentController.likeComment
);
router.get("/me/comments", authMiddleware, commentController.getMyComments);

export default router;
