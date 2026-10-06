import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import Sqids from "sqids";
import { getDb } from "../db/client";
import { links as linksTable } from "../db/schema";

const LinkSchema = z
	.object({
		originalUrl: z.string().openapi({ example: "https://google.com" }),
		shortUrl: z.string().openapi({ example: "fd7hj2" }),
	})
	.openapi("Link");

const CreateLinkSchema = z
	.object({
		originalUrl: z.url().openapi({ example: "https://google.com" }),
		alias: z
			.string()
			.regex(/^[A-Za-z0-9_-]{3,32}$/)
			.optional()
			.openapi({ example: "goog" }),
	})
	.openapi("CreateLink");

const postLink = createRoute({
	method: "post",
	path: "/links",
	operationId: "postLink",
	tags: ["links"],
	request: {
		body: {
			required: true,
			content: { "application/json": { schema: CreateLinkSchema } },
		},
	},
	responses: {
		201: {
			description: "New link created",
			content: { "application/json": { schema: LinkSchema } },
		},
	},
});

const sqids = new Sqids({ minLength: 6 });

const generateShortUrl = (key: number) => sqids.encode([key]);

export const links = new OpenAPIHono().openapi(postLink, async (c) => {
	const { originalUrl, alias } = c.req.valid("json");
	const db = getDb();

	const { rows } = await db.execute<{ id: string }>(
		sql`select nextval(pg_get_serial_sequence('links', 'id')) as id`,
	);

	const id = Number(rows[0]?.id);

	const [link] = await db
		.insert(linksTable)
		.values({ id, shortUrl: alias ?? generateShortUrl(id), originalUrl })
		.onConflictDoNothing()
		.returning();

	if (!link) {
		throw new HTTPException(409, { message: "Short URL already in use" });
	}

	return c.json(
		{ originalUrl: link.originalUrl, shortUrl: link.shortUrl },
		201,
	);
});
