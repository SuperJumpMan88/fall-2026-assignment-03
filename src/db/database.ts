import {
  Kysely,
  PostgresDialect,
} from "kysely";
import pg from "pg";

const { Pool } = pg;

/* ============================
   TABLE DEFINITIONS
   ============================ */

export interface UsersTable {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface TicketsTable {
  id: number;
  title: string;
  description: string | null;
  status: string;
  creator_id: number;
  assignee_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface TimeLogsTable {
  id: number;
  ticket_id: number;
  user_id: number;
  hours: number;
  logged_at: Date;
}

export interface Database {
  users: UsersTable;
  tickets: TicketsTable;
  time_logs: TimeLogsTable;
}

/* ============================
   SELECT TYPES (PLAIN)
   ============================ */

export type User = UsersTable;
export type Ticket = TicketsTable;
export type TimeLog = TimeLogsTable;

/* ============================
   INSERT TYPES (PLAIN OBJECTS)
   ============================ */

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type NewTicket = {
  title: string;
  description: string | null;
  status: string;
  creator_id: number;
  assignee_id: number | null;
};

export type NewTimeLog = {
  ticket_id: number;
  user_id: number;
  hours: number;
};

/* ============================
   DATABASE INSTANCE
   ============================ */

export function createDatabase(connectionString?: string): Kysely<Database> {
  const url =
    connectionString ||
    (process.env.NODE_ENV === "test" && process.env.TEST_DATABASE_URL
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/issue_tracker");

  const pool = new Pool({
    connectionString: url,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool,
    }),
  });
}

export let db = createDatabase();

/* ============================
   TESTING SUPPORT
   ============================ */

export function setDatabase(newDb: Kysely<Database>): void {
  db = newDb;
}
