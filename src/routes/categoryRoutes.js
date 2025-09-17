import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {authenticate,authorize} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id",authenticate, authorize(["admin"]), deleteCategory);

export default router;
