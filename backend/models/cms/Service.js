import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    longDescription: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },
    icon: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    price: mongoose.Schema.Types.Decimal128,
    currency: { type: String, default: "USD" },
    duration: String,
    features: [String],
    benefits: [String],
    relatedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    order: Number,
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "services",
  }
);

serviceSchema.index({ site: 1, slug: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ featured: 1 });
serviceSchema.index({ status: 1 });

export default mongoose.model("Service", serviceSchema);
