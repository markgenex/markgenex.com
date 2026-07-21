import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
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
    proposalNumber: {
      type: String,
      unique: true,
      required: true,
    },
    title: String,
    description: String,
    lineItems: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
        description: String,
        quantity: Number,
        unitPrice: mongoose.Schema.Types.Decimal128,
        total: mongoose.Schema.Types.Decimal128,
      },
    ],
    subtotal: mongoose.Schema.Types.Decimal128,
    tax: mongoose.Schema.Types.Decimal128,
    total: mongoose.Schema.Types.Decimal128,
    currency: { type: String, default: "USD" },
    terms: String,
    conditions: String,
    validFrom: Date,
    validUntil: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected", "expired"],
      default: "draft",
    },
    sentAt: Date,
    viewedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    pdfUrl: String,
    externalId: String,
  },
  {
    timestamps: true,
    collection: "proposals",
  }
);

proposalSchema.index({ deal: 1 });
proposalSchema.index({ contact: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ validUntil: 1 });

export default mongoose.model("Proposal", proposalSchema);
