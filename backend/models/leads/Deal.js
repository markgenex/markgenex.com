import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmCompany",
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmContact",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Deal name is required"],
      trim: true,
    },
    description: String,
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Deal amount is required"],
    },
    currency: { type: String, default: "USD" },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PipelineStage",
      required: true,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
    },
    expectedCloseDate: Date,
    actualCloseDate: Date,
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lineItems: [
      {
        description: String,
        quantity: Number,
        unitPrice: mongoose.Schema.Types.Decimal128,
        total: mongoose.Schema.Types.Decimal128,
      },
    ],
    externalId: String,
    externalSource: String,
    tags: [String],
    notes: String,
  },
  {
    timestamps: true,
    collection: "deals",
  }
);

dealSchema.index({ organization: 1, stage: 1 });
dealSchema.index({ owner: 1 });
dealSchema.index({ expectedCloseDate: 1 });
dealSchema.index({ externalId: 1, externalSource: 1 });

export default mongoose.model("Deal", dealSchema);
