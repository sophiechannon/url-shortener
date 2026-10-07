import { z } from "@hono/zod-openapi";

export const PaginationSchema = z
	.object({
		limit: z.coerce.number().int().min(1).default(25),
		page: z.coerce.number().int().min(0).default(0),
	})
	.openapi("Pagination");
