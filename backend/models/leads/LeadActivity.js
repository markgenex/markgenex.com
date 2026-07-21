import mongoose from "mongoose";

const leadActivitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "email", "note", "meeting", "message", "status_change"],
      required: true,
    },
    title: String,
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    duration: Number,
    outcome: String,
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
    relatedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "lead_activities",
  }
);

leadActivitySchema.index({ lead: 1, createdAt: -1 });
leadActivitySchema.index({ type: 1 });
leadActivitySchema.index({ user: 1 });

export default mongoose.model("LeadActivity", leadActivitySchema);
