import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
    },
    email: String,
    phone: String,
    bio: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String,
    },
    expertise: [String],
    order: Number,
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "team_members",
  }
);

teamMemberSchema.index({ site: 1 });
teamMemberSchema.index({ status: 1 });

export default mongoose.model("TeamMember", teamMemberSchema);
