import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    category: String,
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    order: Number,
    helpfulYes: { type: Number, default: 0 },
    helpfulNo: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
    },
  },
  {
    timestamps: true,
    collection: "faqs",
  }
);

faqSchema.index({ site: 1, category: 1 });
faqSchema.index({ status: 1 });

export default mongoose.model("FAQ", faqSchema);
