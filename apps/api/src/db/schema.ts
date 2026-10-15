import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable(
	"links",
	{
		id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
		shortUrl: text("short_url").unique().notNull(),
		originalUrl: text("original_url").notNull(),
		// Clerk user id. Null for links created while signed out.
		userId: text("user_id"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	// Serves "my links, newest first" with cursor pagination.
	(t) => [index("links_user_id_id_idx").on(t.userId, t.id)],
);

export type Link = typeof links.$inferSelect;
