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
      lowercase: true,
    },
    phone: String,
    normalizedEmail: {
      type: String,
      lowercase: true,
    },
    normalizedPhone: String,
    company: String,
    industry: String,
    budgetRange: String,
    city: String,
    state: String,
    country: String,
    businessRequirement: String,
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
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormSubmission",
      },
    ],
    attribution: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String,
      campaignSource: String,
      landingPage: String,
      referrer: String,
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
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    consent: {
      marketing: { type: Boolean, default: false },
      privacyPolicy: { type: Boolean, default: false },
      terms: { type: Boolean, default: false },
      text: String,
      capturedAt: Date,
      ipAddress: String,
      userAgent: String,
    },
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
leadSchema.index({ normalizedEmail: 1, organization: 1 });
leadSchema.index({ normalizedPhone: 1, organization: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
