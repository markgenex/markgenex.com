import mongoose from "mongoose";

const projectMilestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProject",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Milestone name is required"],
    },
    description: String,
    order: Number,
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "blocked"],
      default: "pending",
    },
    startDate: Date,
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: Date,
    deliverables: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completionPercentage: Number,
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectMilestone",
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectDocument",
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
    collection: "project_milestones",
  }
);

projectMilestoneSchema.index({ project: 1, order: 1 });
projectMilestoneSchema.index({ status: 1, dueDate: 1 });

export default mongoose.model("ProjectMilestone", projectMilestoneSchema);
