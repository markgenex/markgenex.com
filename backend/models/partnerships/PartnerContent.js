import mongoose from "mongoose";

const partnerContentSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  name: { type: String, required: [true, "Partner name is required"], trim: true },
  description: { type: String, required: [true, "Short description is required"], trim: true },
  displayOrder: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: Date,
}, { timestamps: true, collection: "partner_content" });

partnerContentSchema.index({ site: 1, displayOrder: 1 });
partnerContentSchema.index({ site: 1, status: 1 });
export default mongoose.model("PartnerContent", partnerContentSchema);
