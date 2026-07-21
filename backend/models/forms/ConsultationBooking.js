import mongoose from "mongoose";

const consultationBookingSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
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
    phone: {
      type: String,
      required: true,
    },
    company: String,
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: String,
    timezone: String,
    duration: {
      type: Number,
      default: 30,
    },
    type: {
      type: String,
      enum: ["virtual", "in-person", "phone"],
      default: "virtual",
    },
    meetingLink: String,
    location: String,
    notes: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "completed", "no-show", "cancelled"],
      default: "pending",
    },
    confirmedAt: Date,
    completedAt: Date,
    cancellationReason: String,
    feedback: {
      rating: Number,
      comments: String,
    },
  },
  {
    timestamps: true,
    collection: "consultation_bookings",
  }
);

consultationBookingSchema.index({ email: 1 });
consultationBookingSchema.index({ status: 1, preferredDate: 1 });
consultationBookingSchema.index({ assignedTo: 1 });

export default mongoose.model("ConsultationBooking", consultationBookingSchema);
