import { Kysely, Migrator } from "kysely";
import { db } from "./database.ts";
import * as initialSchema from "./migrations/001_initial_schema.ts";
import * as timeLogs from "./migrations/002_time_logs.ts";

async function runMigrations(direction: "up" | "down") {
  const migrator = new Migrator({
    db,
    provider: {
      async getMigrations() {
        return {
          "001_initial_schema": {
            up: initialSchema.up,
            down: initialSchema.down,
          },
          "002_time_logs": {
            up: timeLogs.up,
            down: timeLogs.down,
          },
        };
      },
    },
  });

  console.log("Migrations available:", await migrator.getMigrations());

  const result =
    direction === "up"
      ? await migrator.migrateUp()
      : await migrator.migrateDown();

  console.log("Migration results:", result);

  if (result.error) {
    console.error("Migration failed:", result.error);
    process.exit(1);
  }

  console.log(`Migration ${direction} completed.`);
}
