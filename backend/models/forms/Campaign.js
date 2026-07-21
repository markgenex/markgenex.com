import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["ppc", "social", "email", "organic", "direct", "referral", "other"],
      required: true,
    },
    channel: String,
    status: {
      type: String,
      enum: ["planning", "active", "paused", "completed", "archived"],
      default: "planning",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    budget: mongoose.Schema.Types.Decimal128,
    currency: { type: String, default: "USD" },
    spent: mongoose.Schema.Types.Decimal128,
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metrics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      leads: { type: Number, default: 0 },
      ctr: Number,
      conversionRate: Number,
      roi: Number,
    },
    targetAudience: {
      ageRange: String,
      locations: [String],
      interests: [String],
      devices: [String],
    },
  },
  {
    timestamps: true,
    collection: "campaigns",
  }
);

campaignSchema.index({ organization: 1, status: 1 });
campaignSchema.index({ startDate: -1 });

export default mongoose.model("Campaign", campaignSchema);
