import express from "express";
import { getMonthlyReport } from "../controllers/reportController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/monthly", authenticate, getMonthlyReport);

export default router;
