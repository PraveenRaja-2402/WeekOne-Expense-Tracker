import prisma from "../prismaClient.js";
import { expenseSchema, expenseUpdateSchema, expenseIdSchema } from "../validators/expenseValidator.js";
import minioClient from "../minioClient.js";
import multer from "multer";

const upload = multer(); // For parsing multipart/form-data

// Create Expense
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

// Get All Expenses (with optional filtering, search, pagination)
export const getExpenses = async (req, res) => {
  try {
    const { categoryId, startDate, endDate, page = 1, limit = 10, sortBy = "date", order = "desc", search } = req.query;

    const where = { userId: req.user.userId };

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

// Get Expense by ID
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

//Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);

    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

//Upload Receipt
export const uploadReceipt = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);

    // Check if expense exists
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const extension = file.originalname.split(".").pop();
    const objectName = `receipts/${id}/${Date.now()}.${extension}`;

    // Upload to MinIO
    await minioClient.putObject(process.env.MINIO_BUCKET, objectName, file.buffer);

    // Save the URL/path in DB
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { receiptUrl: objectName },
    });

    res.json({ message: "Receipt uploaded", expense: updatedExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get Receipt
export const getReceipt = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);
    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || !expense.receiptUrl) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const url = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET,
      expense.receiptUrl,
      60 * 60 // 1 hour
    );

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete Receipt
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = expenseIdSchema.parse(req.params);
    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || !expense.receiptUrl) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    await minioClient.removeObject(process.env.MINIO_BUCKET, expense.receiptUrl);

    await prisma.expense.update({
      where: { id },
      data: { receiptUrl: null },
    });

    res.json({ message: "Receipt deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
