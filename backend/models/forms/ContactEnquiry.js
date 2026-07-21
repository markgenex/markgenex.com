import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSubmission",
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: String,
    company: String,
    message: {
      type: String,
      required: true,
    },
    subject: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "open", "in-progress", "responded", "closed"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    response: {
      message: String,
      respondedBy: mongoose.Schema.Types.ObjectId,
      respondedAt: Date,
    },
    closedAt: Date,
    closedReason: String,
  },
  {
    timestamps: true,
    collection: "contact_enquiries",
  }
);

contactEnquirySchema.index({ email: 1 });
contactEnquirySchema.index({ status: 1 });
contactEnquirySchema.index({ assignedTo: 1 });

export default mongoose.model("ContactEnquiry", contactEnquirySchema);
