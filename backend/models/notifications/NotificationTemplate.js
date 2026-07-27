import mongoose from "mongoose";

const notificationTemplateSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    code: {
      type: String,
      uppercase: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["email", "sms", "whatsapp", "push", "in_app"],
      required: true,
    },
    subject: String,
    content: {
      type: String,
      required: true,
    },
    plainText: String,
    htmlContent: String,
    variables: [
      {
        name: String,
        description: String,
        required: Boolean,
      },
    ],
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "notification_templates",
  }
);

notificationTemplateSchema.index({ organization: 1, type: 1 });
notificationTemplateSchema.index({ code: 1 }, { unique: true, sparse: true });

export default mongoose.model("NotificationTemplate", notificationTemplateSchema);
