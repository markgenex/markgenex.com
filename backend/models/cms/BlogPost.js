import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Blog post title is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    excerpt: String,
    content: {
      type: String,
      required: [true, "Blog post content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    tags: [String],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
      canonicalUrl: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    featured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    estimatedReadTime: Number,
    comments: [
      {
        author: String,
        email: String,
        content: String,
        approved: Boolean,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    collection: "blog_posts",
  }
);

blogPostSchema.index({ site: 1, slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ author: 1 });

export default mongoose.model("BlogPost", blogPostSchema);
