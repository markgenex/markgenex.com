import mongoose from "mongoose";

const clientProjectSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmCompany",
      required: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: String,
    scope: String,
    status: {
      type: String,
      enum: ["planning", "in_progress", "on_hold", "completed", "cancelled"],
      default: "planning",
    },
    startDate: Date,
    endDate: Date,
    expectedEndDate: Date,
    budget: mongoose.Schema.Types.Decimal128,
    spent: mongoose.Schema.Types.Decimal128,
    currency: { type: String, default: "USD" },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teamMembers: [
      {
        user: mongoose.Schema.Types.ObjectId,
        role: String,
      },
    ],
    milestone: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectMilestone",
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    completionPercentage: Number,
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectDocument",
      },
    ],
  },
  {
    timestamps: true,
    collection: "client_projects",
  }
);

clientProjectSchema.index({ company: 1, status: 1 });
clientProjectSchema.index({ projectManager: 1 });
clientProjectSchema.index({ startDate: -1 });

export default mongoose.model("ClientProject", clientProjectSchema);
