import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

// ✅ Create a new expense
router.post("/", createExpense);

// ✅ Get all expenses (supports pagination + filters)
router.get("/", getExpenses);

// ✅ Get a single expense by ID
router.get("/:id", getExpenseById);

// ✅ Update expense by ID
router.put("/:id", updateExpense);

// ✅ Delete expense by ID
router.delete("/:id", deleteExpense);

export default router;
