import { db, Ticket, NewTicket } from "../db/database.js";
import { sql } from "kysely";

export interface GetTicketsOptions {
  limit?: number;
  offset?: number;
  status?: string;
}

export async function getTickets(
  options: GetTicketsOptions = {}
): Promise<Ticket[]> {
  const { limit, offset, status } = options;

  let query = db.selectFrom("tickets").selectAll();

  if (status) {
    query = query.where("status", "=", status);
  }
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  if (offset !== undefined) {
    query = query.offset(offset);
  }

  return await query.orderBy("id", "asc").execute();
}

export async function getTicketById(id: number): Promise<Ticket | undefined> {
  return await db
    .selectFrom("tickets")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  return await db
    .insertInto("tickets")
    .values({
      ...ticket,
      id: sql<number>`default`,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateTicketStatus(
  id: number,
  status: string
): Promise<Ticket | undefined> {
  return await db
    .updateTable("tickets")
    .set({ status, updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
