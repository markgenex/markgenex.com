import mongoose from "mongoose";

const crmCompanySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    website: String,
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    annualRevenue: mongoose.Schema.Types.Decimal128,
    currency: String,
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CrmContact",
      },
    ],
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
    collection: "crm_companies",
  }
);

crmCompanySchema.index({ organization: 1, name: 1 });
crmCompanySchema.index({ externalId: 1, externalSource: 1 });

export default mongoose.model("CrmCompany", crmCompanySchema);
