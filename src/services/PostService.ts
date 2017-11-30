import { Post } from "../interfaces/Post";
import { IPostRepository } from "../repositories/IPostRepository";

export class PostService {
  // تزریق وابستگی (Dependency Injection) در سازنده
  // Service تنها به قرارداد (Interface) Repository وابسته است.
  constructor(private postRepository: IPostRepository) {}

  public async getAllPosts(searchTerm?: string): Promise<Post[]> {
    // منطق تجاری می‌تواند در اینجا اضافه شود
    return this.postRepository.findAll(searchTerm);
  }

  public async getPostById(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  public async createPost(
    postData: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<Post> {
    // منطق تجاری مانند اعتبارسنجی‌های پیچیده یا فراخوانی سرویس‌های دیگر
    return this.postRepository.create(postData);
  }

  public async updatePost(
    id: string,
    postData: Partial<Post>
  ): Promise<Post | null> {
    return this.postRepository.update(id, postData);
  }

  public async deletePost(id: string): Promise<boolean> {
    return this.postRepository.delete(id);
  }
}
