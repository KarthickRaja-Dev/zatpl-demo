import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { fetchStatus, updateTopicStatus, updateStatus } from "../controllers/statusController.js";

const router = express.Router();
///api/status/get/id
router.put("/update/:id", updateStatus);
router.get("/get/:id", protect,fetchStatus);
router.put("/update/task/:id", updateTopicStatus);
export default router;