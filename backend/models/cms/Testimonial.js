import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    author: {
      name: {
        type: String,
        required: [true, "Author name is required"],
      },
      jobTitle: String,
      company: String,
      image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    },
    content: {
      type: String,
      required: [true, "Testimonial content is required"],
    },
    type: {
      type: String,
      enum: ["text", "video"],
      default: "text",
    },
    videoUrl: String,
    videoThumbnail: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    caseStudy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseStudy",
    },
    verifiedCustomer: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: Date,
    order: Number,
  },
  {
    timestamps: true,
    collection: "testimonials",
  }
);

testimonialSchema.index({ site: 1, status: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ rating: -1 });

export default mongoose.model("Testimonial", testimonialSchema);
