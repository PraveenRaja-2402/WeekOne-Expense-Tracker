import express from "express";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API running....");
});

app.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
