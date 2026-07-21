import mongoose from "mongoose";

const dailyMetricSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    date: {
      type: Date,
      required: true,
    },
    traffic: {
      pageViews: { type: Number, default: 0 },
      uniqueVisitors: { type: Number, default: 0 },
      sessions: { type: Number, default: 0 },
      sessionDuration: Number,
      bounceRate: Number,
    },
    leads: {
      newLeads: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      conversionRate: Number,
      qualified: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
    },
    campaigns: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      ctr: Number,
      spend: mongoose.Schema.Types.Decimal128,
      roi: Number,
    },
    sales: {
      deals: { type: Number, default: 0 },
      revenue: mongoose.Schema.Types.Decimal128,
      averageDealSize: mongoose.Schema.Types.Decimal128,
    },
    engagement: {
      formSubmissions: { type: Number, default: 0 },
      emailOpens: { type: Number, default: 0 },
      emailClicks: { type: Number, default: 0 },
      videoPlays: { type: Number, default: 0 },
    },
    topPages: [
      {
        pageId: mongoose.Schema.Types.ObjectId,
        views: Number,
      },
    ],
    topCampaigns: [
      {
        campaignId: mongoose.Schema.Types.ObjectId,
        leads: Number,
        spend: mongoose.Schema.Types.Decimal128,
      },
    ],
    geography: {
      topCountries: [
        {
          country: String,
          visitors: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: "daily_metrics",
  }
);

dailyMetricSchema.index({ organization: 1, date: -1 }, { unique: true });
dailyMetricSchema.index({ site: 1, date: -1 });

export default mongoose.model("DailyMetric", dailyMetricSchema);
