import { Document, Schema, model } from "mongoose";
import { Post } from "../interfaces/Post";

// Mongoose Schema Definition
const PostSchema = new Schema<Post & Document>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const PostMongooseModel = model<Post & Document>("Post", PostSchema);
