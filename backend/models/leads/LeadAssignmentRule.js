import mongoose from "mongoose";

const leadAssignmentRuleSchema = new mongoose.Schema(
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
      required: [true, "Rule name is required"],
      trim: true,
    },
    description: String,
    ruleType: {
      type: String,
      enum: ["fixed", "round_robin", "workload_based", "skill_based"],
      required: true,
    },
    condition: {
      field: String,
      operator: { type: String, enum: ["equals", "contains", "starts_with", "is_in"] },
      value: mongoose.Schema.Types.Mixed,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    weights: mongoose.Schema.Types.Mixed,
    roundRobinIndex: Number,
    enabled: {
      type: Boolean,
      default: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
    collection: "lead_assignment_rules",
  }
);

leadAssignmentRuleSchema.index({ organization: 1, priority: 1 });
leadAssignmentRuleSchema.index({ enabled: 1 });

export default mongoose.model("LeadAssignmentRule", leadAssignmentRuleSchema);
