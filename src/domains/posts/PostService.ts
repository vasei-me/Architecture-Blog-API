import { Types } from "mongoose";
import ApiError from "../../shared/errors/ApiError";
import { CreatePostInput, PostResponse, UpdatePostInput } from "./Post";
import PostModel from "./PostModel";

export class PostService {
  async createPost(
    postData: CreatePostInput,
    authorId: string
  ): Promise<PostResponse> {
    try {
      const post = await PostModel.create({
        ...postData,
        author: authorId,
      });

      await post.populate("author", "username email");

      return {
        success: true,
        message: "Post created successfully",
        data: { post },
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(400, "A post with this title already exists");
      }
      throw error;
    }
  }

  async getPostById(postId: string): Promise<PostResponse> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
      }

      const post = await PostModel.findById(postId).populate(
        "author",
        "username email"
      );
      // .populate('categories', 'name slug');  // موقتاً غیرفعال

      if (!post) {
        throw new ApiError(404, "Post not found");
      }

      // Increment views
      post.views += 1;
      await post.save();

      return {
        success: true,
        message: "Post retrieved successfully",
        data: { post },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPosts(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PostResponse> {
    try {
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (status && ["published", "draft", "archived"].includes(status)) {
        filter.status = status;
      } else {
        filter.status = "published"; // Default to published posts
      }

      const [posts, total] = await Promise.all([
        PostModel.find(filter)
          .populate("author", "username email")
          // .populate('categories', 'name slug')  // موقتاً غیرفعال
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        PostModel.countDocuments(filter),
      ]);

      return {
        success: true,
        message: "Posts retrieved successfully",
        posts,
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

  async updatePost(
    postId: string,
    updateData: UpdatePostInput,
    authorId: string
  ): Promise<PostResponse> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
      }

      const post = await PostModel.findOne({ _id: postId, author: authorId });

      if (!post) {
        throw new ApiError(
          404,
          "Post not found or you are not authorized to update this post"
        );
      }

      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { ...updateData },
        { new: true, runValidators: true }
      ).populate("author", "username email");
      // .populate('categories', 'name slug');  // موقتاً غیرفعال

      return {
        success: true,
        message: "Post updated successfully",
        data: { post: updatedPost! },
      };
    } catch (error) {
      throw error;
    }
  }

  async deletePost(postId: string, authorId: string): Promise<PostResponse> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
      }

      const post = await PostModel.findOne({ _id: postId, author: authorId });

      if (!post) {
        throw new ApiError(
          404,
          "Post not found or you are not authorized to delete this post"
        );
      }

      await PostModel.findByIdAndDelete(postId);

      return {
        success: true,
        message: "Post deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PostResponse> {
    try {
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        PostModel.find({ author: userId })
          .populate("author", "username email")
          // .populate('categories', 'name slug')  // موقتاً غیرفعال
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        PostModel.countDocuments({ author: userId }),
      ]);

      return {
        success: true,
        message: "User posts retrieved successfully",
        posts,
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

export default new PostService();
