import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmCompany",
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmContact",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    accessLevel: {
      type: String,
      enum: ["view_only", "collaborator", "admin"],
      default: "collaborator",
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientProject",
      },
    ],
    allowedResources: [String],
    approvalRequired: Boolean,
    twoFactorEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "client_profiles",
  }
);

clientProfileSchema.index({ user: 1 });
clientProfileSchema.index({ company: 1, status: 1 });

export default mongoose.model("ClientProfile", clientProfileSchema);
