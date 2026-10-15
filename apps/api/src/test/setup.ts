import { beforeAll, beforeEach, vi } from "vitest";
import { migrateTestDb, resetTestDb } from "./db";

vi.mock("../db/client", async () => {
	const { testDb } = await import("./db");
	return { getDb: () => testDb };
});

// Tests sign in with `Authorization: Bearer user_<name>`; the token is the
// user id. Anything else is rejected like an invalid Clerk session token.
vi.mock("@clerk/backend", () => ({
	verifyToken: async (token: string) => {
		if (!token.startsWith("user_")) throw new Error("Invalid token");
		return { sub: token };
	},
}));

beforeAll(async () => {
	await migrateTestDb();
});

beforeEach(async () => {
	await resetTestDb();
});
