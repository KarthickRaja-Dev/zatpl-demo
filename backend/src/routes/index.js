import express from "express";
import userRoutes from "./userRoutes.js";
import candidateRoutes from "./candidateRoutes.js";
import reportRoutes from "./reportRoutes.js";
import utilRoutes from "./utilRoutes.js"
import statusRoutes from "./statusRoute.js"
import NextBatch from "../model/NextBatch.js"
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/users",userRoutes);
router.use("/candidates",protect, candidateRoutes);
router.use("/reports" ,protect,reportRoutes);
router.use("/programs", protect,utilRoutes);
router.use("/status", protect, statusRoutes);
router.post("/next-batch/add", async (req, res) => {
  try {
    const schedules = req.body;
    console.log("BODY : ",req.body)
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res
        .status(400)
        .json({ message: "Expected an array of schedules" });
    }
// {
//     candidateName: 'Hemaanand',
//     trainingName: [ 'Master Program in Advanced Web Development with GEN AI' ],
//     inTime: '11:30',
//     outTime: '13:30',
//     date: '2025-04-19',
//     present: null,
//     reasonForLeave: '',
//     staffName: 'Karthick Raja'
//   }
    const validSchedules = schedules.map((schedule) => {
        console.log("Schedule :",schedule)
      const {
        candidateName,
        trainingName,
        inTime,
        outTime,
        date,
        present,
        reasonForLeave,
        staffName
      } = schedule;
      return new NextBatch({
        candidateName,
        trainingName,
        staffName,
        inTime,
        outTime,
        date,
        present: present ?? true,
        reasonForLeave: reasonForLeave ?? "",
      });
    });

    const savedSchedules = await NextBatch.insertMany(validSchedules);

    res.status(201).json({
      message: "Next batches scheduled successfully",
      schedules: savedSchedules,
    });
  } catch (error) {
    console.error("Error scheduling next batches:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/next-batch/:date", async (req, res) => {
  const { date } = req.params;
  console.log("Get Batch for date:", date);

  try {
    // Parse input date and set range from start to end of the day
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    // Find schedules for the whole day (ignores time issues)
    const schedules = await NextBatch.find({
      date: { $gte: targetDate, $lt: nextDay },
    })
    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for this date" });
    }
    // Return the next upcoming batch
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching next batch:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
export default router;
