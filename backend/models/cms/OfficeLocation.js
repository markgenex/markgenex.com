import mongoose from "mongoose";

const officeLocationSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Office name is required"],
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    phone: String,
    email: String,
    website: String,
    workingHours: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        open: String,
        close: String,
        isClosed: Boolean,
      },
    ],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teams: [String],
    order: Number,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "office_locations",
  }
);

officeLocationSchema.index({ site: 1 });
officeLocationSchema.index({ "coordinates": "2dsphere" });

export default mongoose.model("OfficeLocation", officeLocationSchema);
