import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [255, "Name must not exceed 255 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, "Website must be a valid URL"],
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      enum: [
        "Technology",
        "Finance",
        "Healthcare",
        "Retail",
        "Manufacturing",
        "Education",
        "Other",
      ],
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    settings: {
      branding: {
        primaryColor: String,
        secondaryColor: String,
        accentColor: String,
      },
      security: {
        passwordPolicy: {
          minLength: { type: Number, default: 8 },
          requireSpecialChars: { type: Boolean, default: true },
          requireNumbers: { type: Boolean, default: true },
        },
        mfaRequired: { type: Boolean, default: false },
        sessionTimeout: { type: Number, default: 3600 },
      },
      notifications: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
      },
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "organizations",
  }
);

organizationSchema.index({ slug: 1 }, { unique: true, sparse: true });
organizationSchema.index({ status: 1 });
organizationSchema.index({ createdAt: -1 });

export default mongoose.model("Organization", organizationSchema);
