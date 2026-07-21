import mongoose from "mongoose";

const dataExportJobSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exportType: {
      type: String,
      enum: ["leads", "contacts", "deals", "analytics", "full_data", "custom"],
      required: true,
    },
    format: {
      type: String,
      enum: ["csv", "json", "xlsx", "pdf"],
      required: true,
    },
    filters: mongoose.Schema.Types.Mixed,
    selectedFields: [String],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "expired"],
      default: "pending",
    },
    totalRecords: Number,
    exportedRecords: Number,
    fileUrl: String,
    fileSize: Number,
    checksum: String,
    expiresAt: Date,
    error: String,
    errorDetails: String,
    startedAt: Date,
    completedAt: Date,
    duration: Number,
    accessLog: [
      {
        downloadedBy: mongoose.Schema.Types.ObjectId,
        downloadedAt: Date,
        ipAddress: String,
      },
    ],
    notificationEmail: String,
  },
  {
    timestamps: true,
    collection: "data_export_jobs",
  }
);

dataExportJobSchema.index({ organization: 1, requestedBy: 1, createdAt: -1 });
dataExportJobSchema.index({ status: 1 });
dataExportJobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("DataExportJob", dataExportJobSchema);
