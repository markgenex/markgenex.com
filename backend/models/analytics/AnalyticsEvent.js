import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    eventType: {
      type: String,
      enum: ["page_view", "form_submit", "link_click", "video_play", "scroll", "conversion", "custom"],
      required: true,
    },
    eventName: String,
    eventProperties: mongoose.Schema.Types.Mixed,
    sessionId: String,
    userId: String,
    anonymousId: String,
    ipAddress: String,
    userAgent: String,
    referrer: String,
    language: String,
    country: String,
    city: String,
    region: String,
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
    },
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      content: String,
      term: String,
    },
    gclid: String,
    fbclid: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "analytics_events",
  }
);

analyticsEventSchema.index({ site: 1, timestamp: -1 });
analyticsEventSchema.index({ sessionId: 1 });
analyticsEventSchema.index({ eventType: 1 });
analyticsEventSchema.index({ lead: 1 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
