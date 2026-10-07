import { z } from "@hono/zod-openapi";
import { PaginationSchema } from "../common/pagination-schema";

export const LinkSchema = z
	.object({
		originalUrl: z.string().openapi({ example: "https://google.com" }),
		shortUrl: z.string().openapi({ example: "fd7hj2" }),
	})
	.openapi("Link");

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

export const ListLinksSearchParamsSchema = z
	.object({
		shortUrl: z.string().optional().openapi({ example: "goog" }),
		...PaginationSchema.shape,
	})
	.openapi("GetLinksSearchParams");

export type ListLinksSearchParams = z.infer<typeof ListLinksSearchParamsSchema>;
