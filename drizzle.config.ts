import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env.local");

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	// Migrations need a direct connection; PgBouncer (the pooled URL) doesn't
	// support the session state they rely on.
	dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
});
