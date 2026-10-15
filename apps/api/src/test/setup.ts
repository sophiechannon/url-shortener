import { beforeAll, beforeEach, vi } from "vitest";
import { migrateTestDb, resetTestDb } from "./db";

vi.mock("../db/client", async () => {
	const { testDb } = await import("./db");
	return { getDb: () => testDb };
});

beforeAll(async () => {
	await migrateTestDb();
});

beforeEach(async () => {
	await resetTestDb();
});
