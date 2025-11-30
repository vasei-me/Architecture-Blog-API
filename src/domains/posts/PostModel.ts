import mongoose, { Schema } from "mongoose";
import { IPost } from "./Post";

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [50, "Content must be at least 50 characters long"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot be more than 300 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
    },
    featuredImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
    readTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    metaTitle: {
      type: String,
      maxlength: [200, "Meta title cannot be more than 200 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [300, "Meta description cannot be more than 300 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment count
PostSchema.virtual("commentCount").get(function (this: any) {
  return this.comments?.length || 0;
});

// Virtual for like count
PostSchema.virtual("likeCount").get(function (this: any) {
  return this.likes?.length || 0;
});

// Generate slug before saving - نسخه بهبود یافته
PostSchema.pre("save", function (next) {
  const post = this as any;

  try {
    // همیشه slug رو از title ایجاد کن
    if (post.title && (!post.slug || post.isModified("title"))) {
      let slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF -]/g, "") // پشتیبانی از حروف فارسی
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .substring(0, 100);

      // اگر slug خالی شد، از timestamp استفاده کن
      if (!slug) {
        slug = `post-${Date.now()}`;
      }

      post.slug = slug;
    }

    // Calculate read time
    if (post.content && post.isModified("content")) {
      const wordCount = post.content.split(/\s+/).length;
      post.readTime = Math.ceil(wordCount / 200);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Indexes for better performance
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ status: 1, createdAt: -1 });
// slug index is already created by unique: true

export default mongoose.model<IPost>("Post", PostSchema);
