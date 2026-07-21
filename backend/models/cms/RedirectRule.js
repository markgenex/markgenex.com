import mongoose from "mongoose";

const redirectRuleSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    sourceUrl: {
      type: String,
      required: [true, "Source URL is required"],
      lowercase: true,
    },
    destinationUrl: {
      type: String,
      required: [true, "Destination URL is required"],
    },
    statusCode: {
      type: Number,
      enum: [301, 302, 307, 308],
      default: 301,
    },
    type: {
      type: String,
      enum: ["permanent", "temporary"],
      default: "permanent",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    redirectCount: {
      type: Number,
      default: 0,
    },
    lastRedirectAt: Date,
    reason: String,
  },
  {
    timestamps: true,
    collection: "redirect_rules",
  }
);

redirectRuleSchema.index({ site: 1, sourceUrl: 1 }, { unique: true });
redirectRuleSchema.index({ enabled: 1 });

export default mongoose.model("RedirectRule", redirectRuleSchema);
