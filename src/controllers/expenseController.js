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

// ✅ Get Expenses (pagination + filters)
export const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, date } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};

    if (category) {
      where.category = { name: { equals: category, mode: "insensitive" } };
    }
    if (date && !isNaN(Date.parse(date))) {
      const parsedDate = new Date(date);
      where.date = {
        gte: parsedDate,
        lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
      };
    }

    const [total, expenses] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        skip,
        take: Number(limit),
        where,
        include: { user: true, category: true },
        orderBy: { date: "desc" },
      }),
    ]);

    res.json({ page: Number(page), limit: Number(limit), total, expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
