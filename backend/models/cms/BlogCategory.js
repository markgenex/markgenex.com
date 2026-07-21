import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    color: String,
    icon: String,
    order: Number,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "blog_categories",
  }
);

blogCategorySchema.index({ site: 1, slug: 1 });

export default mongoose.model("BlogCategory", blogCategorySchema);
