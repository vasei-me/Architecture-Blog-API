import { Request, Response } from "express";
import { PostService } from "../services/PostService";

export class PostController {
  // تزریق وابستگی Service
  constructor(private postService: PostService) {}

  // GET /posts
  public getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = req.query.search as string;
      const posts = await this.postService.getAllPosts(searchTerm);
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // GET /posts/:id
  public getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const post = await this.postService.getPostById(id);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // POST /posts
  public createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      // اعتبارسنجی ساده بدنه درخواست
      const postData = req.body;
      if (!postData.title || !postData.content) {
        res.status(400).json({ message: "Title and content are required." });
        return;
      }

      const newPost = await this.postService.createPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // PUT /posts/:id
  public updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const updatedPost = await this.postService.updatePost(id, req.body);

      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // DELETE /posts/:id
  public deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const deleted = await this.postService.deletePost(id);

      if (!deleted) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
