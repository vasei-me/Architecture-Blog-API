import { Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId;
  categories: Types.ObjectId[];
  tags: string[];
  slug: string;
  featuredImage?: string;
  status: "published" | "draft" | "archived";
  readTime: number;
  views: number;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  status?: "published" | "draft" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  excerpt?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
  status?: "published" | "draft" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data?: {
    post: IPost;
  };
  posts?: IPost[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
