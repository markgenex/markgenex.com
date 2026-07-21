import mongoose from "mongoose";

const applicationActivitySchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerApplication",
      required: true,
    },
    type: {
      type: String,
      enum: ["status_change", "note_added", "interview_scheduled", "email_sent", "feedback", "offer"],
      required: true,
    },
    title: String,
    description: String,
    oldStatus: String,
    newStatus: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: mongoose.Schema.Types.Mixed,
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
  },
  {
    timestamps: true,
    collection: "application_activities",
  }
);

applicationActivitySchema.index({ application: 1, createdAt: -1 });
applicationActivitySchema.index({ type: 1 });

export default mongoose.model("ApplicationActivity", applicationActivitySchema);
