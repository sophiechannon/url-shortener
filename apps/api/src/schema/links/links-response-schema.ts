import { z } from "@hono/zod-openapi";

export const LinkSchema = z
	.object({
		originalUrl: z.string().openapi({ example: "https://google.com" }),
		shortUrl: z.string().openapi({ example: "fd7hj2" }),
	})
	.openapi("Link");

export const ListLinksSchema = z.object({
	items: z.array(LinkSchema),
	nextCursor: z.number().int().nullable(),
});

export const CreateLinkSchema = z
	.object({
		originalUrl: z.url().openapi({ example: "https://google.com" }),
		alias: z
			.string()
			.regex(/^[A-Za-z0-9_-]{3,32}$/)
			.optional()
			.openapi({ example: "goog" }),
	})
	.openapi("CreateLink");
