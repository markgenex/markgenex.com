import mongoose from "mongoose";

const reusableBlockSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Block name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["cta", "banner", "component", "hero", "footer", "nav", "other"],
      required: true,
    },
    content: mongoose.Schema.Types.Mixed,
    html: String,
    css: String,
    js: String,
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: {
      type: Number,
      default: 1,
    },
    description: String,
  },
  {
    timestamps: true,
    collection: "reusable_blocks",
  }
);

reusableBlockSchema.index({ site: 1, type: 1 });
reusableBlockSchema.index({ status: 1 });

export default mongoose.model("ReusableBlock", reusableBlockSchema);
