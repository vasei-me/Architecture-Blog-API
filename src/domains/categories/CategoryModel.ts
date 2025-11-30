import mongoose, { Schema } from "mongoose";
import { ICategory } from "./Category";

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      required: false, // موقتاً غیرفعال کن
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for post count
CategorySchema.virtual("postCount").get(function (this: any) {
  return this.posts?.length || 0;
});

// Generate slug before saving - نسخه مطمئن
CategorySchema.pre("save", function (next) {
  const category = this as any;

  try {
    // همیشه slug رو از name ایجاد کن
    if (category.name && (!category.slug || category.isModified("name"))) {
      let slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .substring(0, 100);

      // اگر slug خالی شد، از timestamp استفاده کن
      if (!slug) {
        slug = `category-${Date.now()}`;
      }

      category.slug = slug;
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Indexes are already created by unique: true on name and slug fields

export default mongoose.model<ICategory>("Category", CategorySchema);
