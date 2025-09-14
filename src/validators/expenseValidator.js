// src/validators/expenseValidator.js
import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  date: z.string().datetime({ message: "Invalid date format" }).optional(),
  userId: z.string().uuid("Invalid userId"),
  categoryId: z.string().uuid("Invalid categoryId"),
});

export const expenseUpdateSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").optional(),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  date: z.string().datetime({ message: "Invalid date format" }).optional(),
  userId: z.string().uuid("Invalid userId").optional(),
  categoryId: z.string().uuid("Invalid categoryId").optional(),
});

export const expenseIdSchema = z.object({
  id: z.string().uuid("Invalid expense ID"),
});
