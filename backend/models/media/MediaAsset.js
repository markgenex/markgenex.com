import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
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
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaFolder",
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "document", "audio", "other"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicUrl: String,
    altText: String,
    title: String,
    description: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    width: Number,
    height: Number,
    duration: Number,
    thumbnail: String,
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    usedIn: [
      {
        type: String,
        modelName: String,
        fieldName: String,
      },
    ],
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "media_assets",
  }
);

mediaAssetSchema.index({ organization: 1 });
mediaAssetSchema.index({ site: 1 });
mediaAssetSchema.index({ type: 1 });
mediaAssetSchema.index({ tags: 1 });

export default mongoose.model("MediaAsset", mediaAssetSchema);
