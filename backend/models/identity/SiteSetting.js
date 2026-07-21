import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      unique: true,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
      ogImage: String,
      twitterCard: String,
      robots: { type: String, default: "index, follow" },
      sitemap: { type: Boolean, default: true },
      canonicalUrl: String,
    },
    tracking: {
      googleAnalyticsId: String,
      googleTagManagerId: String,
      facebookPixelId: String,
      hotjarId: String,
      customPixels: [
        {
          name: String,
          code: String,
        },
      ],
    },
    leadCapture: {
      captchaEnabled: { type: Boolean, default: true },
      captchaVersion: { type: String, enum: ["v2", "v3"], default: "v3" },
      captchaSiteKey: String,
      leadSource: { type: String, default: "website" },
      autoAssignLeads: { type: Boolean, default: true },
    },
    social: {
      facebookAppId: String,
      twitterHandle: String,
      instagramHandle: String,
      linkedinCompanyUrl: String,
      youtubeChannelUrl: String,
    },
    notifications: {
      emailOnNewLead: { type: Boolean, default: true },
      notificationEmail: String,
      webhookUrl: String,
    },
    security: {
      corsOrigins: [String],
      allowedIpAddresses: [String],
      requireHttps: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    collection: "site_settings",
  }
);

siteSettingSchema.index({ site: 1 });

export default mongoose.model("SiteSetting", siteSettingSchema);
