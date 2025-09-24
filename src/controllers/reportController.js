import prisma from "../prismaClient.js";

export const getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    if (!month) return res.status(400).json({ error: "Month is required" });

    const [year, monthNum] = month.split("-").map(Number);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1); // first day of next month

    const categories = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: { date: { gte: startDate, lt: endDate } },
      _sum: { amount: true },
    });

    // Fetch category names
    const categoryIds = categories.map(c => c.categoryId);
    const categoryData = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = Object.fromEntries(categoryData.map(c => [c.id, c.name]));

    const totalSpent = categories.reduce((acc, c) => acc + (c._sum.amount || 0), 0);

    res.json({
      month,
      totalSpent,
      categories: categories.map(c => ({
        name: categoryMap[c.categoryId] || "Unknown",
        amount: c._sum.amount,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
