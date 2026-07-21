import mongoose from "mongoose";

const pipelineStageSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Stage name is required"],
      trim: true,
    },
    description: String,
    order: {
      type: Number,
      required: true,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    color: String,
    icon: String,
    dealCount: { type: Number, default: 0 },
    totalValue: mongoose.Schema.Types.Decimal128,
    isWon: Boolean,
    isLost: Boolean,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "pipeline_stages",
  }
);

pipelineStageSchema.index({ organization: 1, order: 1 });

export default mongoose.model("PipelineStage", pipelineStageSchema);
