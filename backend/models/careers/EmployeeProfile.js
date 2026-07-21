import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    jobTitle: String,
    department: String,
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfficeLocation",
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "on_leave", "inactive"],
      default: "active",
    },
    salaryInfo: {
      currency: String,
      amount: mongoose.Schema.Types.Decimal128,
      frequency: { type: String, enum: ["annual", "monthly"] },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    skills: [String],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issueDate: Date,
        expirationDate: Date,
        document: mongoose.Schema.Types.ObjectId,
      },
    ],
    performance: {
      reviews: [
        {
          date: Date,
          rating: Number,
          reviewer: mongoose.Schema.Types.ObjectId,
        },
      ],
      rating: Number,
    },
  },
  {
    timestamps: true,
    collection: "employee_profiles",
  }
);

employeeProfileSchema.index({ organization: 1, status: 1 });
employeeProfileSchema.index({ user: 1 });
employeeProfileSchema.index({ employeeId: 1 });

export default mongoose.model("EmployeeProfile", employeeProfileSchema);
