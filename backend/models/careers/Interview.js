import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerApplication",
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["phone_screen", "video_interview", "technical", "in_person", "panel"],
    },
    scheduledAt: Date,
    duration: Number,
    interviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    completedAt: Date,
    notes: String,
    ratings: [
      {
        interviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        feedback: String,
      },
    ],
    verdict: {
      type: String,
      enum: ["pending", "pass", "fail", "borderline"],
      default: "pending",
    },
    nextRound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
  },
  {
    timestamps: true,
    collection: "interviews",
  }
);

interviewSchema.index({ application: 1, round: 1 });
interviewSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model("Interview", interviewSchema);
