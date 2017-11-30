import { Post } from "../interfaces/Post";

export interface IPostRepository {
  // Read Operations
  findAll(searchTerm?: string): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;

  // Write Operations
  create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  update(id: string, post: Partial<Post>): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}
