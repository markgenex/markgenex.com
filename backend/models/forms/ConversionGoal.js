import mongoose from "mongoose";

const conversionGoalSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["page_visit", "form_submission", "purchase", "signup", "click", "scroll", "custom"],
      required: true,
    },
    triggerType: {
      type: String,
      enum: ["url", "event", "element", "time_on_page"],
    },
    triggerValue: String,
    value: mongoose.Schema.Types.Decimal128,
    currency: String,
    category: String,
    eventName: String,
    eventProperties: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    conversionCount: { type: Number, default: 0 },
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
  },
  {
    timestamps: true,
    collection: "conversion_goals",
  }
);

conversionGoalSchema.index({ site: 1, status: 1 });
conversionGoalSchema.index({ type: 1 });

export default mongoose.model("ConversionGoal", conversionGoalSchema);
