import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../auth/AuthInterfaces";
import { CreatePostInput, UpdatePostInput } from "./Post";
import postService from "./PostService";

export class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const postData: CreatePostInput = req.body;

      const result = await postService.createPost(postData, user.userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await postService.getPostById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await postService.getPosts(page, limit, status);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const { id } = req.params;
      const updateData: UpdatePostInput = req.body;

      const result = await postService.updatePost(id, updateData, user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const { id } = req.params;

      const result = await postService.deletePost(id, user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await postService.getUserPosts(user.userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as JwtPayload;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await postService.getUserPosts(user.userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
