import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    icon: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    order: Number,
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
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
    collection: "service_categories",
  }
);

serviceCategorySchema.index({ site: 1, slug: 1 });
serviceCategorySchema.index({ status: 1 });

export default mongoose.model("ServiceCategory", serviceCategorySchema);
