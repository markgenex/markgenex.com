import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormDefinition",
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    data: mongoose.Schema.Types.Mixed,
    email: {
      type: String,
      lowercase: true,
    },
    phone: String,
    name: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      content: String,
      term: String,
    },
    gclid: String,
    fbclid: String,
    referrer: String,
    userAgent: String,
    ipAddress: String,
    language: String,
    country: String,
    city: String,
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
    },
    status: {
      type: String,
      enum: ["new", "processing", "processed", "failed"],
      default: "new",
    },
    processedAt: Date,
    errors: [String],
  },
  {
    timestamps: true,
    collection: "form_submissions",
  }
);

formSubmissionSchema.index({ site: 1, form: 1, createdAt: -1 });
formSubmissionSchema.index({ email: 1 });
formSubmissionSchema.index({ status: 1 });
formSubmissionSchema.index({ lead: 1 });

export default mongoose.model("FormSubmission", formSubmissionSchema);
