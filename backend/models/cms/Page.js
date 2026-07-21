import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      lowercase: true,
      trim: true,
    },
    description: String,
    content: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currentRevision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PageRevision",
    },
    revisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PageRevision",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "members-only"],
      default: "public",
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "pages",
  }
);

pageSchema.index({ site: 1, slug: 1 }, { unique: true });
pageSchema.index({ status: 1 });
pageSchema.index({ publishedAt: -1 });

export default mongoose.model("Page", pageSchema);
