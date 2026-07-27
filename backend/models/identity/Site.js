import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
    },
    domain: {
      type: String,
      lowercase: true,
    },
    subdomain: {
      type: String,
      lowercase: true,
    },
    description: String,
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    favicon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    branding: {
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,
      fontFamily: String,
    },
    locale: {
      type: String,
      default: "en-US",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    contactEmail: String,
    contactPhone: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "sites",
  }
);

siteSchema.index({ organization: 1 });
siteSchema.index({ domain: 1 }, { unique: true, sparse: true });
siteSchema.index({ subdomain: 1 }, { unique: true, sparse: true });
siteSchema.index({ status: 1 });

export default mongoose.model("Site", siteSchema);
