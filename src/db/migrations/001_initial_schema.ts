/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", col => col.primaryKey())
    .addColumn("name", "varchar(255)", col => col.notNull())
    .addColumn("email", "varchar(255)", col => col.notNull().unique())
    .addColumn("password", "varchar(255)", col => col.notNull())
    .addColumn("created_at", "timestamptz", col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await db.schema
    .createTable("tickets")
    .addColumn("id", "serial", col => col.primaryKey())
    .addColumn("title", "varchar(255)", col => col.notNull())
    .addColumn("description", "text")
    .addColumn("status", "varchar(50)", col => col.notNull())
    .addColumn("creator_id", "integer", col =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("assignee_id", "integer", col =>
      col.references("users.id").onDelete("set null")
    )
    .addColumn("created_at", "timestamptz", col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("tickets").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();
}
