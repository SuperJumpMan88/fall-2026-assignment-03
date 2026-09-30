import { Router } from "express";
import * as ticketsDal from "../dal/tickets.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const { limit, offset, status } = req.query;

  const tickets = await ticketsDal.getTickets({
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    status: status ? String(status) : undefined,
  });

  res.json(tickets);
});

router.get("/:id", async (req, res) => {
  const ticket = await ticketsDal.getTicketById(Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Not found" });
  res.json(ticket);
});

router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  const creatorId = res.locals.userId;

  const ticket = await ticketsDal.createTicket({
    title,
    description,
    status: "open",
    creator_id: creatorId,   // matches DB schema
    assignee_id: null,
  });

  res.status(201).json(ticket);
});

router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  const ticket = await ticketsDal.updateTicketStatus(
    Number(req.params.id),
    status
  );

  res.json(ticket);
});

export default router;
