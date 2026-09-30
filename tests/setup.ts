import { beforeAll, beforeEach, afterAll } from 'vitest';
import { sql } from 'kysely';
import { db } from '../src/db/database.js';
import { migrateToLatest } from '../src/db/migrator.js';

beforeAll(async () => {
  try {
    await migrateToLatest(db);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'ECONNREFUSED'
    ) {
      console.error(
        '\n❌ Could not connect to PostgreSQL database on port 5432.\n   Please start the database before running tests: docker compose up -d\n',
      );
    }
    throw err;
  }
});

beforeEach(async () => {
  try {
    // Dynamically discover all user-defined tables so this setup works
    // for Part 1 (users, tickets) and Part 2 (+ time_logs) without
    // any changes needed from students.
    const result = await sql<{ tablename: string }>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT LIKE 'kysely_%'
    `.execute(db);

    if (result.rows.length > 0) {
      const tableList = result.rows.map((r) => `"${r.tablename}"`).join(', ');
      await sql
        .raw(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`)
        .execute(db);
    }
  } catch {
    // Ignore if tables are not yet created
  }
});

afterAll(async () => {
  await db.destroy();
});
