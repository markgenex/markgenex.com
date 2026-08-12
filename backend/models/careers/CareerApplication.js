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
    },
    source: { type: String, enum: ["website", "email"], default: "website" },
    inboundMessageId: { type: String, sparse: true },
    emailSubject: String,
    emailMessage: String,
    emailAttachments: [
      {
        fileName: String,
        contentType: String,
        size: Number,
        data: String,
      },
    ],
    currentPosition: String,
    currentCompany: String,
    experience: String,
    coverLetter: String,
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    resumeData: String,
    resumeFileName: String,
    resumeStorageName: String,
    resumeMimeType: String,
    resumeSize: Number,
    portfolio: String,
    linkedinProfile: String,
    githubProfile: String,
    status: {
      type: String,
      enum: ["New", "Reviewed", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "New",
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
careerApplicationSchema.index({ inboundMessageId: 1 }, { unique: true, sparse: true });

export default mongoose.model("CareerApplication", careerApplicationSchema);
