import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  posts: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data?: {
    category: ICategory;
  };
  categories?: ICategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
