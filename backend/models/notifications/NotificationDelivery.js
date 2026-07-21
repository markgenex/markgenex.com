import mongoose from "mongoose";

const notificationDeliverySchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationTemplate",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipientEmail: String,
    recipientPhone: String,
    type: {
      type: String,
      enum: ["email", "sms", "whatsapp", "push", "in_app"],
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "bounced"],
      default: "pending",
    },
    variables: mongoose.Schema.Types.Mixed,
    content: String,
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastAttemptAt: Date,
    sentAt: Date,
    deliveredAt: Date,
    openedAt: Date,
    clickedAt: Date,
    failureReason: String,
    errorMessage: String,
    externalId: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "notification_deliveries",
  }
);

notificationDeliverySchema.index({ template: 1, status: 1 });
notificationDeliverySchema.index({ recipient: 1 });
notificationDeliverySchema.index({ createdAt: -1 });

export default mongoose.model("NotificationDelivery", notificationDeliverySchema);
