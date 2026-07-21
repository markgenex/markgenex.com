import mongoose from "mongoose";

const navigationMenuSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Menu name is required"],
      enum: ["header", "footer", "mobile", "secondary"],
    },
    items: [
      {
        label: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        page: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Page",
        },
        order: Number,
        children: [
          {
            label: String,
            url: String,
            page: mongoose.Schema.Types.ObjectId,
            order: Number,
          },
        ],
        target: { type: String, enum: ["_self", "_blank", "_parent"], default: "_self" },
        icon: String,
        badge: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "navigation_menus",
  }
);

navigationMenuSchema.index({ site: 1, name: 1 }, { unique: true });

export default mongoose.model("NavigationMenu", navigationMenuSchema);
