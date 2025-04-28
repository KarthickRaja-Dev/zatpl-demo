import mongoose from "mongoose"
const scheduleSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    trainingName:{
        type: [String],
    },
    staffName: {
    type:String,
      required: true,
    },
    inTime: {
      type: String, 
    },
    outTime: {
      type: String, 
    },
    present: {
      type: Boolean,
      default: true, 
    },
    reasonForLeave: {
      type: String,
      default: "", 
    },
    date: {
      type: Date,
      required: true, 
    },
  },
  { timestamps: true } 
);
const NextBatch = mongoose.model("NextBatches",scheduleSchema)
export default NextBatch;
