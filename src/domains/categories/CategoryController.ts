import { NextFunction, Request, Response } from "express";
import { CreateCategoryInput, UpdateCategoryInput } from "./Category";
import categoryService from "./CategoryService";

export class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryData: CreateCategoryInput = req.body;

      const result = await categoryService.createCategory(categoryData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await categoryService.getAllCategories(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await categoryService.getCategoryById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const result = await categoryService.getCategoryBySlug(slug);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateCategoryInput = req.body;

      const result = await categoryService.updateCategory(id, updateData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await categoryService.deleteCategory(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPopularCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await categoryService.getPopularCategories(limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addPostToCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { postId } = req.body;

      const result = await categoryService.addPostToCategory(id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removePostFromCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { postId } = req.body;

      const result = await categoryService.removePostFromCategory(id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
