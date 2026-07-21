import mongoose from "mongoose";

const crmContactSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmCompany",
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
    jobTitle: String,
    department: String,
    role: {
      type: String,
      enum: ["decision_maker", "influencer", "user", "other"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    leads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
      },
    ],
    deals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal",
      },
    ],
    externalId: String,
    externalSource: String,
    tags: [String],
    notes: String,
  },
  {
    timestamps: true,
    collection: "crm_contacts",
  }
);

crmContactSchema.index({ organization: 1, email: 1 });
crmContactSchema.index({ company: 1 });
crmContactSchema.index({ externalId: 1, externalSource: 1 });

export default mongoose.model("CrmContact", crmContactSchema);
