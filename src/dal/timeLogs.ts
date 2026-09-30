import { db } from "../db/database.js";
import { sql } from "kysely";

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number
) {
  return await db
    .insertInto("time_logs")
    .values({
      id: sql`default`,
      ticket_id: ticketId,
      user_id: userId,
      hours,
      logged_at: sql`default`,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTotalHoursForTicket(ticketId: number): Promise<number> {
  const result = await db
    .selectFrom("time_logs")
    .select(db.fn.sum("hours").as("total"))
    .where("ticket_id", "=", ticketId)
    .executeTakeFirst();

  return Number(result?.total ?? 0);
}
