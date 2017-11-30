import { Document } from "mongoose";
import { Post } from "../interfaces/Post";
import { PostMongooseModel } from "../models/PostModel";
import { IPostRepository } from "./IPostRepository";

// تعریف یک تایپ کمکی برای سند Mongoose همراه با رابط پست ما
type PostDocument = Post & Document;

export class MongoPostRepository implements IPostRepository {
  // تابع کمکی برای نگاشت سند Mongoose به رابط Post ما
  private mapToPost(doc: PostDocument): Post {
    // اطمینان از تبدیل ObjectId به string
    const post = doc.toObject({ getters: true }) as any;
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  public async findAll(searchTerm?: string): Promise<Post[]> {
    let query: any = {};
    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i"); // 'i' برای جستجوی Case-insensitive
      // جستجوی Wildcard در title, content, یا category
      query = {
        $or: [
          { title: { $regex: regex } },
          { content: { $regex: regex } },
          { category: { $regex: regex } },
        ],
      };
    }

    const docs = (await PostMongooseModel.find(query).exec()) as PostDocument[];
    return docs.map(this.mapToPost);
  }

  public async findById(id: string): Promise<Post | null> {
    const doc = (await PostMongooseModel.findById(
      id
    ).exec()) as PostDocument | null;
    return doc ? this.mapToPost(doc) : null;
  }

  public async create(
    postData: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<Post> {
    const newPost = new PostMongooseModel(postData);
    const savedDoc = (await newPost.save()) as PostDocument;
    return this.mapToPost(savedDoc);
  }

  public async update(
    id: string,
    postData: Partial<Post>
  ): Promise<Post | null> {
    // بروزرسانی timestamp updated
    postData.updatedAt = new Date();

    const updatedDoc = (await PostMongooseModel.findByIdAndUpdate(
      id,
      { $set: postData },
      { new: true } // برگرداندن سند پس از بروزرسانی
    ).exec()) as PostDocument | null;

    return updatedDoc ? this.mapToPost(updatedDoc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await PostMongooseModel.findByIdAndDelete(id).exec();
    // اگر سندی حذف شده باشد، result خالی نیست
    return !!result;
  }
}
