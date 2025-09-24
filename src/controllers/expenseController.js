import prisma from "../prismaClient.js";
import { expenseSchema, expenseUpdateSchema, expenseIdSchema } from "../validators/expenseValidator.js";

// ✅ Create Expense
export const createExpense = async (req, res) => {
  try {
    const parsed = expenseSchema.parse(req.body);

    const expense = await prisma.expense.create({
      data: {
        ...parsed,
        date: parsed.date ? new Date(parsed.date) : new Date(),
      },
    });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// src/controllers/expenseController.js
export const getExpenses = async (req, res) => {
  try {
    const { categoryId, startDate, endDate, page = 1, limit = 10, sortBy = "date", order = "desc", search } = req.query;

    const where = { userId: req.user.userId }; // only user’s expenses

    if (categoryId) where.categoryId = categoryId;
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (search) {
      where.description = { contains: search, mode: "insensitive" };
    }

    const expenses = await prisma.expense.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { [sortBy]: order },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get Expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: { user: true, category: true },
    });

    if (!expense) return res.status(404).json({ error: "Expense not found" });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// ✅ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);
    const parsed = expenseUpdateSchema.parse(req.body);

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...parsed,
        date: parsed.date ? new Date(parsed.date) : undefined,
      },
    });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// ✅ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);

    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};
