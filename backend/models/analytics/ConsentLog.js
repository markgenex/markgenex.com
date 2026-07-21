import mongoose from "mongoose";

const consentLogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    email: {
      type: String,
      lowercase: true,
    },
    phone: String,
    consentType: {
      type: String,
      enum: ["marketing_email", "marketing_sms", "marketing_phone", "profiling", "cookies", "terms_and_conditions"],
      required: true,
    },
    action: {
      type: String,
      enum: ["granted", "withdrawn", "updated"],
      required: true,
    },
    source: {
      type: String,
      enum: ["form_submission", "email_link", "preference_center", "manual", "api"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ipAddress: String,
    userAgent: String,
    consentVersion: String,
    consentText: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "consent_logs",
  }
);

consentLogSchema.index({ organization: 1, timestamp: -1 });
consentLogSchema.index({ lead: 1 });
consentLogSchema.index({ email: 1 });
consentLogSchema.index({ consentType: 1 });

export default mongoose.model("ConsentLog", consentLogSchema);
