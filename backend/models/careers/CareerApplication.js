import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    jobOpening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpening",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    currentPosition: String,
    currentCompany: String,
    experience: String,
    coverLetter: String,
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
      required: true,
    },
    portfolio: String,
    linkedinProfile: String,
    githubProfile: String,
    status: {
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "interview", "rejected", "withdrawn"],
      default: "submitted",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
    appliedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "career_applications",
  }
);

careerApplicationSchema.index({ jobOpening: 1, status: 1 });
careerApplicationSchema.index({ email: 1 });
careerApplicationSchema.index({ status: 1, appliedAt: -1 });

export default mongoose.model("CareerApplication", careerApplicationSchema);
