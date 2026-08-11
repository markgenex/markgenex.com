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
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    idempotencyKey: String,
    submissionType: {
      type: String,
      enum: ["lead", "contact", "consultation", "service_enquiry", "admin"],
      default: "lead",
    },
    data: mongoose.Schema.Types.Mixed,
    email: {
      type: String,
      lowercase: true,
    },
    normalizedEmail: {
      type: String,
      lowercase: true,
    },
    phone: String,
    normalizedPhone: String,
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
    landingPage: String,
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
      enum: ["new", "processing", "processed", "duplicate", "spam", "failed"],
      default: "new",
    },
    processedAt: Date,
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    spam: {
      flagged: { type: Boolean, default: false },
      reasons: [String],
      score: { type: Number, default: 0 },
    },
    consent: {
      marketing: { type: Boolean, default: false },
      privacyPolicy: { type: Boolean, default: false },
      terms: { type: Boolean, default: false },
      text: String,
      capturedAt: Date,
      ipAddress: String,
      userAgent: String,
    },
    errors: [String],
  },
  {
    timestamps: true,
    collection: "form_submissions",
    suppressReservedKeysWarning: true,
  }
);

formSubmissionSchema.index({ site: 1, form: 1, createdAt: -1 });
formSubmissionSchema.index(
  { site: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } },
);
formSubmissionSchema.index({ email: 1 });
formSubmissionSchema.index({ normalizedEmail: 1 });
formSubmissionSchema.index({ normalizedPhone: 1 });
formSubmissionSchema.index({ status: 1 });
formSubmissionSchema.index({ lead: 1 });
formSubmissionSchema.index({ submissionType: 1, service: 1, createdAt: -1 });

export default mongoose.model("FormSubmission", formSubmissionSchema);
