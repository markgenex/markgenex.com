import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    permissions: [
      {
        resource: {
          type: String,
          enum: [
            "users",
            "roles",
            "sites",
            "pages",
            "forms",
            "leads",
            "analytics",
            "settings",
            "integrations",
          ],
        },
        actions: [
          {
            type: String,
            enum: ["create", "read", "update", "delete"],
          },
        ],
      },
    ],
    isSystem: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "roles",
  }
);

roleSchema.index({ organization: 1, name: 1 });
roleSchema.index({ status: 1 });

export default mongoose.model("Role", roleSchema);
