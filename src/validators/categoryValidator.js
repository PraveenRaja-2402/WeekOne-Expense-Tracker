import { z } from "zod";

// Schema for creating category
export const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
});

// Schema for updating category
export const categoryUpdateSchema = categorySchema.partial();

// Schema for validating category ID
export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});
