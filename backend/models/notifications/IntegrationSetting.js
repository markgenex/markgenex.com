import mongoose from "mongoose";

const integrationSettingSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    provider: {
      type: String,
      enum: ["slack", "salesforce", "hubspot", "pipedrive", "zoho", "twilio", "sendgrid", "stripe", "other"],
      required: true,
    },
    name: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    apiKey: {
      type: String,
      select: false,
    },
    apiSecret: {
      type: String,
      select: false,
    },
    webhookUrl: String,
    webhookSecret: {
      type: String,
      select: false,
    },
    accessToken: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    expiresAt: Date,
    config: mongoose.Schema.Types.Mixed,
    mappings: {
      fieldMappings: mongoose.Schema.Types.Mixed,
      customMappings: mongoose.Schema.Types.Mixed,
    },
    sync: {
      autoSync: { type: Boolean, default: false },
      lastSyncAt: Date,
      syncInterval: Number,
      direction: { type: String, enum: ["one_way", "two_way"], default: "one_way" },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "inactive",
    },
    lastError: String,
    configuredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "integration_settings",
  }
);

integrationSettingSchema.index({ organization: 1, provider: 1 }, { unique: true });
integrationSettingSchema.index({ isActive: 1 });

export default mongoose.model("IntegrationSetting", integrationSettingSchema);
