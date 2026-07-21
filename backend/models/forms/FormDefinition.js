import mongoose from "mongoose";

const formDefinitionSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Form name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    fields: [
      {
        id: String,
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["text", "email", "phone", "number", "textarea", "select", "checkbox", "radio", "date", "file"],
          required: true,
        },
        label: String,
        placeholder: String,
        required: Boolean,
        validation: {
          pattern: String,
          minLength: Number,
          maxLength: Number,
          min: Number,
          max: Number,
        },
        options: [
          {
            label: String,
            value: String,
          },
        ],
        order: Number,
      },
    ],
    successMessage: String,
    redirectUrl: String,
    destinations: [
      {
        type: {
          type: String,
          enum: ["email", "webhook", "crm", "database"],
        },
        config: mongoose.Schema.Types.Mixed,
      },
    ],
    captchaEnabled: { type: Boolean, default: true },
    captchaVersion: { type: String, enum: ["v2", "v3"], default: "v3" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    submissionCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "form_definitions",
  }
);

formDefinitionSchema.index({ site: 1, slug: 1 });
formDefinitionSchema.index({ status: 1 });

export default mongoose.model("FormDefinition", formDefinitionSchema);
