import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    trainingStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User model (Staff/Admin)
      required: true,
    },
    trainingName: {
      type: String,
      required: true,
    },
    scheduleConductedTodayBy: {
      type: String,
    },
    inTime: {
      type: String,
    },
    outTime: {
      type: String,
    },
    modeOfTraining: {
      type: String,
    },
    topicTaken: {
      type: String,
    },
    topicStatus: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    present: {
      type: Boolean,
      required: true,
    },
    reasonForLeave: {
      type: String,
    },
    OT: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);

export default Report;
