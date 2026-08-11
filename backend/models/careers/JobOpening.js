import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    shortDescription: String,
    department: String,
    location: String,
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
    },
    workMode: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      default: "remote",
    },
    experienceRequired: String,
    salaryRange: String,
    numberOfOpenings: { type: Number, default: 1 },
    applicationDeadline: Date,
    displayOrder: { type: Number, default: 0 },
    seniority: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
    },
    salaryMin: mongoose.Schema.Types.Decimal128,
    salaryMax: mongoose.Schema.Types.Decimal128,
    currency: { type: String, default: "USD" },
    responsibilities: [String],
    qualifications: [String],
    benefits: [String],
    skills: [String],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "filled"],
      default: "draft",
    },
    publishedAt: Date,
    closedAt: Date,
    applicationCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "job_openings",
  }
);

jobOpeningSchema.index({ site: 1, slug: 1 });
jobOpeningSchema.index({ status: 1, publishedAt: -1 });
jobOpeningSchema.index({ site: 1, displayOrder: 1 });

export default mongoose.model("JobOpening", jobOpeningSchema);
