import mongoose from "mongoose";

const metricSchema = new mongoose.Schema({ value: { type: String, required: true, trim: true }, label: { type: String, required: true, trim: true } }, { _id: false });
const caseStudySchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  title: { type: String, required: [true, "Case study title is required"], trim: true },
  slug: { type: String, lowercase: true, trim: true },
  clientName: { type: String, required: [true, "Client or brand name is required"], trim: true },
  industry: { type: String, required: [true, "Industry is required"], trim: true },
  bannerImage: { type: String, required: [true, "Case study image is required"], trim: true },
  metrics: { type: [metricSchema], validate: { validator: (items) => items.length === 3, message: "Exactly three metrics are required" } },
  services: [{ type: String, trim: true }],
  displayOrder: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: Date,
}, { timestamps: true, collection: "case_studies" });

caseStudySchema.index({ site: 1, slug: 1 }, { unique: true });
caseStudySchema.index({ site: 1, status: 1, displayOrder: 1 });
export default mongoose.model("CaseStudy", caseStudySchema);
