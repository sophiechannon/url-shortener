import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const createDb = (url: string) => drizzle(neon(url), { schema });

let db: ReturnType<typeof createDb> | undefined;

// Created on first use so importing the app (e.g. to generate openapi.json)
// doesn't require DATABASE_URL. Uses the HTTP driver: one-shot queries with no
// connection to hold open between Lambda invocations.
export const getDb = () => {
	if (!db) {
		const url = process.env.DATABASE_URL;
		if (!url) {
			throw new Error("DATABASE_URL is not set");
		}
		db = createDb(url);
	}
	return db;
};
