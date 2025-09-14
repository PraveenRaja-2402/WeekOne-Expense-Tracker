// src/controllers/categoryController.js
import { PrismaClient } from "@prisma/client";
import { categorySchema, categoryUpdateSchema, categoryIdSchema } from "../validators/categoryValidator.js";

const prisma = new PrismaClient();

// Create Category
export const createCategory = async (req, res) => {
  try {
    const parsed = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: parsed,
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    const parsed = categoryUpdateSchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data: parsed,
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = categoryIdSchema.parse(req.params);

    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};
