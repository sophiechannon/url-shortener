import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	shortUrl: text("short_url").unique().notNull(),
	originalUrl: text("original_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Link = typeof links.$inferSelect;
