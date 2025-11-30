import mongoose, { Schema } from "mongoose";
import { IComment } from "./Comment";

const CommentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [2, "Comment must be at least 2 characters long"],
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "spam"],
      default: "approved",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for replies
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

// Virtual for like count
CommentSchema.virtual("likeCount").get(function (this: any) {
  return this.likes?.length || 0;
});

// Virtual for reply count
CommentSchema.virtual("replyCount").get(function (this: any) {
  return this.replies?.length || 0;
});

// Index for better performance
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

export default mongoose.model<IComment>("Comment", CommentSchema);
