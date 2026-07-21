import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "alert"],
      default: "info",
    },
    category: {
      type: String,
      enum: ["system", "user_action", "lead_activity", "deal_update", "task", "other"],
    },
    actionUrl: String,
    actionLabel: String,
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    archived: {
      type: Boolean,
      default: false,
    },
    archivedAt: Date,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "user_notifications",
  }
);

userNotificationSchema.index({ user: 1, read: 1, archived: 1 });
userNotificationSchema.index({ createdAt: -1 });

export default mongoose.model("UserNotification", userNotificationSchema);
