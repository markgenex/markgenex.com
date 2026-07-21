import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      enum: [
        "create",
        "read",
        "update",
        "delete",
        "export",
        "login",
        "logout",
        "password_change",
        "permission_change",
        "config_change",
        "integration_connect",
        "bulk_operation",
      ],
      required: true,
    },
    resource: {
      type: String,
      enum: [
        "user",
        "lead",
        "deal",
        "contact",
        "page",
        "form",
        "campaign",
        "role",
        "setting",
        "integration",
        "report",
      ],
      required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    description: String,
    oldValues: mongoose.Schema.Types.Mixed,
    newValues: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },
    errorMessage: String,
    affectedCount: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "audit_logs",
  }
);

auditLogSchema.index({ organization: 1, timestamp: -1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
