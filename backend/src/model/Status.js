import mongoose from "mongoose";

const statusSchema = mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    topics: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    tasks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Status = mongoose.model("Status", statusSchema);
