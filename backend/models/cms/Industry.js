import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Industry name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    industryNumber: String,
    mainImage: String,
    imageAlt: String,
    challenges: [
      {
        text: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    outcomes: [
      {
        text: { type: String, required: true },
        highlighted: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    ctaText: { type: String, default: "Talk to an Industry Specialist" },
    ctaLink: { type: String, default: "/consultation" },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    metaDescription: String,
    keywords: [String],
    icon: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    order: Number,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "industries",
  }
);

industrySchema.index({ site: 1, slug: 1 });
industrySchema.index({ site: 1, status: 1, order: 1 });

export default mongoose.model("Industry", industrySchema);
