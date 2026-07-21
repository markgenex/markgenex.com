import mongoose from "mongoose";

const pageRevisionSchema = new mongoose.Schema(
  {
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
    title: String,
    content: String,
    sections: [
      {
        id: String,
        type: String,
        props: mongoose.Schema.Types.Mixed,
      },
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
      ogImage: String,
      canonicalUrl: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    version: Number,
    message: String,
    status: {
      type: String,
      enum: ["draft", "review", "approved", "published"],
      default: "draft",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    publishedAt: Date,
  },
  {
    timestamps: true,
    collection: "page_revisions",
  }
);

pageRevisionSchema.index({ page: 1, version: 1 });
pageRevisionSchema.index({ status: 1 });

export default mongoose.model("PageRevision", pageRevisionSchema);
