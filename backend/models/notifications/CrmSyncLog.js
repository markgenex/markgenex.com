import mongoose from "mongoose";

const crmSyncLogSchema = new mongoose.Schema(
  {
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IntegrationSetting",
      required: true,
    },
    entityType: {
      type: String,
      enum: ["lead", "contact", "company", "deal", "opportunity"],
      required: true,
    },
    localEntityId: mongoose.Schema.Types.ObjectId,
    externalEntityId: String,
    externalSource: String,
    action: {
      type: String,
      enum: ["create", "update", "delete", "sync"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed", "skipped"],
      default: "pending",
    },
    syncedData: mongoose.Schema.Types.Mixed,
    externalData: mongoose.Schema.Types.Mixed,
    error: String,
    errorDetails: String,
    attemptCount: { type: Number, default: 1 },
    lastAttemptAt: Date,
    nextRetryAt: Date,
  },
  {
    timestamps: true,
    collection: "crm_sync_logs",
  }
);

crmSyncLogSchema.index({ integration: 1, entityType: 1 });
crmSyncLogSchema.index({ localEntityId: 1, externalEntityId: 1 });
crmSyncLogSchema.index({ status: 1, nextRetryAt: 1 });

export default mongoose.model("CrmSyncLog", crmSyncLogSchema);
