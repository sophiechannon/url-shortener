import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../db/schema";

// In-process Postgres (WASM) so route tests run real SQL against the real
// migrations, without a network connection to Neon.
export const testDb = drizzle(new PGlite(), { schema });

export const migrateTestDb = () =>
	migrate(testDb, {
		migrationsFolder: path.resolve(import.meta.dirname, "../../drizzle"),
	});

// RESTART IDENTITY resets the id sequence so generated short URLs are predictable.
export const resetTestDb = () =>
	testDb.execute(sql`truncate table links restart identity`);
