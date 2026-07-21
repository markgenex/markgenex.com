import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: String,
    company: String,
    industry: String,
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    source: {
      type: String,
      enum: ["website_form", "email", "phone", "referral", "social", "other"],
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSubmission",
    },
    attribution: {
      source: String,
      medium: String,
      campaign: String,
      gclid: String,
      fbclid: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost", "archived"],
      default: "new",
    },
    qualification: {
      budget: mongoose.Schema.Types.Decimal128,
      authority: Boolean,
      need: String,
      timeline: String,
      score: Number,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    crmContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmContact",
    },
    crmCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmCompany",
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
    tags: [String],
    notes: String,
    lastActivity: Date,
    nextFollowUp: Date,
  },
  {
    timestamps: true,
    collection: "leads",
  }
);

leadSchema.index({ email: 1, organization: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
