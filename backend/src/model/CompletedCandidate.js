import mongoose from "mongoose";

const CompletedCandidateSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      unique: true,
    },
    completionDate: { type: Date, required: true }, // Only new field
  },
  { timestamps: true }
);

export default mongoose.model("CompletedCandidate", CompletedCandidateSchema);
