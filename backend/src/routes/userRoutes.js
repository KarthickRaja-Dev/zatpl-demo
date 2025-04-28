import express from "express";
import { registerUser, loginUser, getStaffs } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/get/staff", protect,getStaffs);

export default router;
