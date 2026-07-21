import mongoose from "mongoose";

const mediaFolderSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaFolder",
      sparse: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaFolder",
      },
    ],
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
    description: String,
    order: Number,
  },
  {
    timestamps: true,
    collection: "media_folders",
  }
);

mediaFolderSchema.index({ site: 1, parent: 1 });

export default mongoose.model("MediaFolder", mediaFolderSchema);
