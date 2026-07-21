import mongoose from "mongoose";

const webhookDeliverySchema = new mongoose.Schema(
  {
    endpoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebhookEndpoint",
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    payload: mongoose.Schema.Types.Mixed,
    signature: String,
    headers: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
    statusCode: Number,
    response: {
      status: Number,
      body: String,
      headers: mongoose.Schema.Types.Mixed,
    },
    error: String,
    attemptNumber: { type: Number, default: 1 },
    maxAttempts: Number,
    nextRetryAt: Date,
    sentAt: Date,
    respondedAt: Date,
    duration: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "webhook_deliveries",
  }
);

webhookDeliverySchema.index({ endpoint: 1, status: 1 });
webhookDeliverySchema.index({ sentAt: -1 });
webhookDeliverySchema.index({ nextRetryAt: 1 });

export default mongoose.model("WebhookDelivery", webhookDeliverySchema);
