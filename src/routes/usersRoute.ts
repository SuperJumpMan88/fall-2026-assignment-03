import { Router } from "express";
import * as usersDal from "../dal/usersDal.js";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await usersDal.getAllUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await usersDal.getUserById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await usersDal.createUser({
    name,
    email,
    password,
  });

  res.status(201).json(user);
});

export default router;
