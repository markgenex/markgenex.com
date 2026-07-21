import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Industry name is required"],
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
    services: [
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "industries",
  }
);

industrySchema.index({ site: 1, slug: 1 });

export default mongoose.model("Industry", industrySchema);
