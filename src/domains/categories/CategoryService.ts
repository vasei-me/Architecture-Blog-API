import { Types } from "mongoose";
import ApiError from "../../shared/errors/ApiError";
import {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./Category";
import CategoryModel from "./CategoryModel";

export class CategoryService {
  async createCategory(
    categoryData: CreateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      // Check if category already exists
      const existingCategory = await CategoryModel.findOne({
        $or: [
          { name: categoryData.name },
          { slug: categoryData.name.toLowerCase().replace(/\s+/g, "-") },
        ],
      });

      if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists");
      }

      const category = await CategoryModel.create(categoryData);

      return {
        success: true,
        message: "Category created successfully",
        data: { category },
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(
          400,
          "Category with this name or slug already exists"
        );
      }
      throw error;
    }
  }

  async getAllCategories(
    page: number = 1,
    limit: number = 50
  ): Promise<CategoryResponse> {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        CategoryModel.find()
          .populate("posts", "title slug")
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit),
        CategoryModel.countDocuments(),
      ]);

      return {
        success: true,
        message: "Categories retrieved successfully",
        categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(categoryId: string): Promise<CategoryResponse> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
      }

      const category = await CategoryModel.findById(categoryId).populate(
        "posts",
        "title slug excerpt author createdAt"
      );

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      return {
        success: true,
        message: "Category retrieved successfully",
        data: { category },
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const category = await CategoryModel.findOne({ slug }).populate(
        "posts",
        "title slug excerpt author createdAt"
      );

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      return {
        success: true,
        message: "Category retrieved successfully",
        data: { category },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    updateData: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
      }

      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      // Check if new name conflicts with existing category
      if (updateData.name && updateData.name !== category.name) {
        const existingCategory = await CategoryModel.findOne({
          name: updateData.name,
          _id: { $ne: categoryId },
        });

        if (existingCategory) {
          throw new ApiError(400, "Category with this name already exists");
        }
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { ...updateData },
        { new: true, runValidators: true }
      ).populate("posts", "title slug");

      return {
        success: true,
        message: "Category updated successfully",
        data: { category: updatedCategory! },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<CategoryResponse> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
      }

      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      // Check if category has posts
      if (category.posts.length > 0) {
        throw new ApiError(
          400,
          "Cannot delete category that has posts. Please reassign posts first."
        );
      }

      await CategoryModel.findByIdAndDelete(categoryId);

      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async getPopularCategories(limit: number = 10): Promise<CategoryResponse> {
    try {
      const categories = await CategoryModel.aggregate([
        {
          $project: {
            name: 1,
            slug: 1,
            description: 1,
            postCount: { $size: "$posts" },
          },
        },
        { $sort: { postCount: -1 } },
        { $limit: limit },
      ]);

      return {
        success: true,
        message: "Popular categories retrieved successfully",
        categories,
      };
    } catch (error) {
      throw error;
    }
  }

  async addPostToCategory(
    categoryId: string,
    postId: string
  ): Promise<CategoryResponse> {
    try {
      if (
        !Types.ObjectId.isValid(categoryId) ||
        !Types.ObjectId.isValid(postId)
      ) {
        throw new ApiError(400, "Invalid category ID or post ID");
      }

      const category = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { $addToSet: { posts: postId } },
        { new: true, runValidators: true }
      ).populate("posts", "title slug excerpt");

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      return {
        success: true,
        message: "Post added to category successfully",
        data: { category },
      };
    } catch (error) {
      throw error;
    }
  }

  async removePostFromCategory(
    categoryId: string,
    postId: string
  ): Promise<CategoryResponse> {
    try {
      if (
        !Types.ObjectId.isValid(categoryId) ||
        !Types.ObjectId.isValid(postId)
      ) {
        throw new ApiError(400, "Invalid category ID or post ID");
      }

      const category = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { $pull: { posts: postId } },
        { new: true }
      ).populate("posts", "title slug");

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      return {
        success: true,
        message: "Post removed from category successfully",
        data: { category },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
