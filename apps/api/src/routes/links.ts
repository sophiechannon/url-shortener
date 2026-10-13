import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { desc, eq, lt, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import Sqids from "sqids";
import { getDb } from "../db/client";
import { links as linksTable } from "../db/schema";
import { CreateLinkSchema, LinkSchema, ListLinksSchema } from "../schema";
import {
	CheckAvailabilitySearchParams,
	LinksParamsSchema,
	ListLinksSearchParamsSchema,
} from "../schema/links/links-params-schema";

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
			content: { "application/json": { schema: ListLinksSchema } },
		},
	},
});

const deleteLink = createRoute({
	method: "delete",
	path: "/links/{id}",
	operationId: "deleteLink",
	tags: ["links"],
	request: {
		params: LinksParamsSchema,
	},
	responses: {
		200: {
			description: "Link deleted",
			content: { "application/json": { schema: LinkSchema } },
		},
		404: {
			description: "Link not found",
		},
	},
});

const checkAvailability = createRoute({
	method: "get",
	path: "/links/availability",
	operationId: "checkAvailability",
	tags: ["links"],
	request: {
		query: CheckAvailabilitySearchParams,
	},
	responses: {
		200: {
			description: "Availability",
			content: { "application/json": { schema: z.boolean() } },
		},
	},
});

const sqids = new Sqids({ minLength: 6 });

const generateShortUrl = (key: number) => sqids.encode([key]);

export const links = new OpenAPIHono()
	.openapi(listLinks, async (c) => {
		const { cursor, limit } = c.req.valid("query");
		const rows = await getDb()
			.select({
				id: linksTable.id,
				originalUrl: linksTable.originalUrl,
				shortUrl: linksTable.shortUrl,
			})
			.from(linksTable)
			.where(cursor ? lt(linksTable.id, cursor) : undefined)
			.orderBy(desc(linksTable.id))
			.limit(limit + 1);

		const hasMore = rows.length > limit;
		const page = rows.slice(0, limit);
		return c.json(
			{
				items: page.map(({ originalUrl, shortUrl }) => ({
					originalUrl,
					shortUrl,
				})),
				nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
			},
			200,
		);
	})
	.openapi(checkAvailability, async (c) => {
		const { shortUrl } = c.req.valid("query");
		const matchedLinks = await getDb()
			.select({
				originalUrl: linksTable.originalUrl,
				shortUrl: linksTable.shortUrl,
			})
			.from(linksTable)
			.where(shortUrl ? eq(linksTable.shortUrl, shortUrl) : undefined)
			.limit(1);
		return c.json(!matchedLinks.length, 200);
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
	})
	.openapi(deleteLink, async (c) => {
		const { id: shortUrl } = c.req.valid("param");

		const [link] = await getDb()
			.delete(linksTable)
			.where(eq(linksTable.shortUrl, shortUrl))
			.returning();

		if (!link) {
			throw new HTTPException(404, { message: "Link not found" });
		}

		return c.json(
			{ originalUrl: link.originalUrl, shortUrl: link.shortUrl },
			200,
		);
	});
