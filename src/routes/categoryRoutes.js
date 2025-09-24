import express from "express";
import {
  createCategory,
  getCategories,
  getCategoriesById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {authenticate,authorize} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoriesById);
router.put("/:id", updateCategory);
router.delete("/:id",authenticate, authorize(["admin"]), deleteCategory);
router.delete("/:id",authenticate, authorize(["admin"]), deleteCategory);

export default router;
