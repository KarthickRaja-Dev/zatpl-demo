import express from "express";
import {
  addCandidate,
  getAllCandidates,
  getCandidatesByPaymentStatus,
  getCandidatesByTrainingStaff,
  updateCandidateTrainingName,
  updateCandidatePaymentDate,
  updateCandidatePaymentStatus,
  deleteCandidateById
} from "../controllers/candidateController.js";

const router = express.Router();

router.post("/add", addCandidate);
router.get("/all", getAllCandidates);
router.get("/payment-pending", getCandidatesByPaymentStatus);
router.get("/staff/:staffId", getCandidatesByTrainingStaff);
router.put("/update-training/:id", updateCandidateTrainingName);
router.put("/update-payment-date/:id", updateCandidatePaymentDate);
router.put("/update-payment-status/:id",updateCandidatePaymentStatus);
router.delete("/delete/:id", deleteCandidateById);
export default router;
