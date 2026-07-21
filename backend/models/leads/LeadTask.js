import mongoose from "mongoose";

const leadTaskSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: String,
    type: {
      type: String,
      enum: ["call", "email", "meeting", "follow_up", "proposal", "other"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completionNotes: String,
    reminders: [
      {
        type: { type: String, enum: ["email", "sms", "in-app"] },
        sentAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    collection: "lead_tasks",
  }
);

leadTaskSchema.index({ lead: 1, status: 1 });
leadTaskSchema.index({ assignedTo: 1, dueDate: 1 });
leadTaskSchema.index({ dueDate: 1 });

export default mongoose.model("LeadTask", leadTaskSchema);
