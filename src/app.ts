import express from "express";
import usersRouter from "./routes/usersRoute.js";
import ticketsRouter from "./routes/tickets.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/auth", authRouter);

export default app;
