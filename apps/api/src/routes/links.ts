import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import Sqids from "sqids";
import { getDb } from "../db/client";
import { links as linksTable } from "../db/schema";
import {
	CreateLinkSchema,
	LinkSchema,
	ListLinksSearchParamsSchema,
} from "../schema";

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

const listLinks = createRoute({
	method: "get",
	path: "/links",
	operationId: "listLinks",
	tags: ["links"],
	request: {
		query: ListLinksSearchParamsSchema,
	},
	responses: {
		200: {
			description: "Links",
			content: { "application/json": { schema: z.array(LinkSchema) } },
		},
	},
});

const sqids = new Sqids({ minLength: 6 });

const generateShortUrl = (key: number) => sqids.encode([key]);

export const links = new OpenAPIHono()
	.openapi(listLinks, async (c) => {
		const { shortUrl, limit } = c.req.valid("query");
		const matchedLinks = await getDb()
			.select({
				originalUrl: linksTable.originalUrl,
				shortUrl: linksTable.shortUrl,
			})
			.from(linksTable)
			.where(shortUrl ? eq(linksTable.shortUrl, shortUrl) : undefined)
			.limit(limit);
		return c.json(matchedLinks, 200);
	})
	.openapi(postLink, async (c) => {
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
