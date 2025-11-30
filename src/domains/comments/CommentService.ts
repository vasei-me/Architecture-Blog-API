import { Types } from "mongoose";
import ApiError from "../../shared/errors/ApiError";
import PostModel from "../posts/PostModel";
import {
  CommentResponse,
  CreateCommentInput,
  UpdateCommentInput,
} from "./Comment";
import CommentModel from "./CommentModel";

export class CommentService {
  async createComment(
    commentData: CreateCommentInput,
    authorId: string
  ): Promise<CommentResponse> {
    try {
      // Check if post exists
      const post = await PostModel.findById(commentData.post);
      if (!post) {
        throw new ApiError(404, "Post not found");
      }

      // Check parent comment if provided
      if (commentData.parentComment) {
        const parentComment = await CommentModel.findById(
          commentData.parentComment
        );
        if (!parentComment) {
          throw new ApiError(404, "Parent comment not found");
        }
      }

      const comment = await CommentModel.create({
        ...commentData,
        author: authorId,
      });

      await comment.populate("author", "username email");
      await comment.populate("parentComment", "content author");

      // Add comment to post's comments array
      await PostModel.findByIdAndUpdate(commentData.post, {
        $push: { comments: comment._id },
      });

      return {
        success: true,
        message: "Comment created successfully",
        data: { comment },
      };
    } catch (error) {
      throw error;
    }
  }

  async getCommentsByPost(
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CommentResponse> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
      }

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        CommentModel.find({
          post: postId,
          parentComment: null, // Only top-level comments
          status: "approved",
        })
          .populate("author", "username email")
          .populate({
            path: "replies",
            match: { status: "approved" },
            populate: {
              path: "author",
              select: "username email",
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        CommentModel.countDocuments({
          post: postId,
          parentComment: null,
          status: "approved",
        }),
      ]);

      return {
        success: true,
        message: "Comments retrieved successfully",
        comments,
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

  async updateComment(
    commentId: string,
    updateData: UpdateCommentInput,
    authorId: string
  ): Promise<CommentResponse> {
    try {
      if (!Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }

      const comment = await CommentModel.findOne({
        _id: commentId,
        author: authorId,
      });

      if (!comment) {
        throw new ApiError(
          404,
          "Comment not found or you are not authorized to update this comment"
        );
      }

      const updatedComment = await CommentModel.findByIdAndUpdate(
        commentId,
        { ...updateData },
        { new: true, runValidators: true }
      )
        .populate("author", "username email")
        .populate("parentComment", "content author");

      return {
        success: true,
        message: "Comment updated successfully",
        data: { comment: updatedComment! },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(
    commentId: string,
    authorId: string
  ): Promise<CommentResponse> {
    try {
      if (!Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }

      const comment = await CommentModel.findOne({
        _id: commentId,
        author: authorId,
      });

      if (!comment) {
        throw new ApiError(
          404,
          "Comment not found or you are not authorized to delete this comment"
        );
      }

      // Remove comment from post's comments array
      await PostModel.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId },
      });

      // Also delete all replies to this comment
      await CommentModel.deleteMany({ parentComment: commentId });

      await CommentModel.findByIdAndDelete(commentId);

      return {
        success: true,
        message: "Comment deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async likeComment(
    commentId: string,
    userId: string
  ): Promise<CommentResponse> {
    try {
      if (!Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }

      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        throw new ApiError(404, "Comment not found");
      }

      // Check if user already liked the comment
      const alreadyLiked = comment.likes.includes(new Types.ObjectId(userId));

      if (alreadyLiked) {
        // Unlike
        comment.likes = comment.likes.filter(
          (like) => like.toString() !== userId
        );
      } else {
        // Like
        comment.likes.push(new Types.ObjectId(userId));
      }

      await comment.save();
      await comment.populate("author", "username email");

      return {
        success: true,
        message: alreadyLiked
          ? "Comment unliked successfully"
          : "Comment liked successfully",
        data: { comment },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserComments(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CommentResponse> {
    try {
      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        CommentModel.find({ author: userId })
          .populate("author", "username email")
          .populate("post", "title slug")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        CommentModel.countDocuments({ author: userId }),
      ]);

      return {
        success: true,
        message: "User comments retrieved successfully",
        comments,
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
}

export default new CommentService();
