import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Case study title is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    summary: String,
    client: {
      name: {
        type: String,
        required: true,
      },
      industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
      },
      logo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    },
    challenge: String,
    solution: String,
    results: [
      {
        metric: String,
        value: String,
        description: String,
      },
    ],
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    testimonial: String,
    testimonialAuthor: String,
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "case_studies",
  }
);

caseStudySchema.index({ site: 1, slug: 1 });
caseStudySchema.index({ status: 1 });
caseStudySchema.index({ featured: 1 });

export default mongoose.model("CaseStudy", caseStudySchema);
