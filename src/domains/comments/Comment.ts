import { Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  parentComment?: Types.ObjectId; // برای پاسخ به کامنت‌ها
  status: "approved" | "pending" | "spam";
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentInput {
  content: string;
  post: string;
  parentComment?: string;
}

export interface UpdateCommentInput {
  content?: string;
  status?: "approved" | "pending" | "spam";
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data?: {
    comment: IComment;
  };
  comments?: IComment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
