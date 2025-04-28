import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    candidateCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    trainingName: {
      type: [String],
      required: true,
    },

    nextPaymentDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    profileImage: {
      type: String,
    },
    trainingStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    leaveCount: {
      type: Number,
      default:0
    },
    modeOfTraining: {
      type: String,
      required: true,
      default: "online",
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);

export default Candidate;
