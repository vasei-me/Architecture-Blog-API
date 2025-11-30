import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../auth/AuthInterfaces";
import { CreateCommentInput, UpdateCommentInput } from "./Comment";
import commentService from "./CommentService";

export class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const commentData: CreateCommentInput = req.body;

      const result = await commentService.createComment(
        commentData,
        user.userId
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await commentService.getCommentsByPost(
        postId,
        page,
        limit
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const { id } = req.params;
      const updateData: UpdateCommentInput = req.body;

      const result = await commentService.updateComment(
        id,
        updateData,
        user.userId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const { id } = req.params;

      const result = await commentService.deleteComment(id, user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const { id } = req.params;

      const result = await commentService.likeComment(id, user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyComments(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await commentService.getUserComments(
        user.userId,
        page,
        limit
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
