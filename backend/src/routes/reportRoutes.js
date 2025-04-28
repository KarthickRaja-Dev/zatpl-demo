import express from "express";
import {
  addReport,
  getOtReportByMonth,
  getReportsByStaffAndDate,
} from "../controllers/reportController.js";
import { adminOnly, staffOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add",staffOnly ,addReport);
router.get("/filter/:staffId/:date",getReportsByStaffAndDate);
router.get("/ot/:staffId", getOtReportByMonth);
export default router;
