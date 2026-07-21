import mongoose from "mongoose";

const projectDocumentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProject",
      required: true,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectMilestone",
    },
    name: {
      type: String,
      required: [true, "Document name is required"],
    },
    description: String,
    type: {
      type: String,
      enum: ["proposal", "contract", "specification", "report", "design", "other"],
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "review", "approved", "archived"],
      default: "draft",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    accessControl: {
      isPublic: { type: Boolean, default: false },
      allowedUsers: [mongoose.Schema.Types.ObjectId],
      requiresApproval: Boolean,
    },
    tags: [String],
  },
  {
    timestamps: true,
    collection: "project_documents",
  }
);

projectDocumentSchema.index({ project: 1, status: 1 });
projectDocumentSchema.index({ milestone: 1 });

export default mongoose.model("ProjectDocument", projectDocumentSchema);
