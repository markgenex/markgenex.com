import mongoose from "mongoose";

const storedImageSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, enum: ["image/jpeg", "image/png", "image/webp", "image/gif"], required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true, select: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true, collection: "stored_images" });

storedImageSchema.index({ site: 1, createdAt: -1 });
export default mongoose.model("StoredImage", storedImageSchema);
