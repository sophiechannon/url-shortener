import { z } from "@hono/zod-openapi";

export const CursorPaginationSchema = z
	.object({
		limit: z.coerce.number().int().min(1).max(100).default(25),
		cursor: z.coerce.number().int().optional(),
	})
	.openapi("CursorPagination");
