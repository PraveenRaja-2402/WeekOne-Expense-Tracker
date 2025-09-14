import { PrismaClient } from "@prisma/client";
import { userSchema } from "../validators/userValidator.js";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const parsed = userSchema.parse(req.body);

    const user = await prisma.user.create({
      data: parsed,
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const updateUser = async (req, res) => {
  try {
    const parsed = userSchema.partial().parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: parsed,
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User deleted" });
};
