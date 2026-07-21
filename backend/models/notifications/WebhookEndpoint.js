import mongoose from "mongoose";

const webhookEndpointSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Webhook name is required"],
    },
    url: {
      type: String,
      required: [true, "Webhook URL is required"],
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
    events: [
      {
        type: String,
        enum: [
          "lead.created",
          "lead.updated",
          "lead.deleted",
          "deal.created",
          "deal.updated",
          "deal.won",
          "deal.lost",
          "form.submitted",
          "contact.created",
          "contact.updated",
        ],
      },
    ],
    headers: mongoose.Schema.Types.Mixed,
    timeout: { type: Number, default: 30 },
    retryPolicy: {
      maxAttempts: { type: Number, default: 5 },
      backoffMultiplier: { type: Number, default: 2 },
      initialDelaySeconds: { type: Number, default: 1 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastTriggeredAt: Date,
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "webhook_endpoints",
  }
);

webhookEndpointSchema.index({ organization: 1, isActive: 1 });

export default mongoose.model("WebhookEndpoint", webhookEndpointSchema);
