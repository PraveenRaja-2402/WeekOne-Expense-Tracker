import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  uploadReceipt,
  getReceipt,
  deleteReceipt
} from "../controllers/expenseController.js";

const router = express.Router();
const upload = multer();

// Expense CRUD
router.post("/", authenticate, createExpense);
router.get("/", authenticate, getExpenses);
router.get("/:id", authenticate, getExpenseById);
router.put("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);

// Receipt management
router.post("/:id/receipt", authenticate, upload.single("file"), uploadReceipt);
router.get("/:id/receipt", authenticate, getReceipt);
router.delete("/:id/receipt", authenticate, deleteReceipt);

export default router;
