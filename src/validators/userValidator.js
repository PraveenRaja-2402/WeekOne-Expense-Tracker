// src/validators/userValidator.js
import { z } from "zod";

// Schema for creating a user
export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"]).default("user")
});

// Schema for updating a user (all fields optional)
export const userUpdateSchema = userSchema.partial();

export const userIdSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});
