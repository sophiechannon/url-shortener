import { z } from "@hono/zod-openapi";
import { CursorPaginationSchema } from "../common/pagination-schema";

export const LinksParamsSchema = z
	.object({
		id: z.string().openapi({ example: "goog" }),
	})
	.openapi("LinksParams");

export const CheckAvailabilitySearchParams = z
	.object({ shortUrl: z.string() })
	.openapi("CheckAvailabilitySearchParams");

export const ListLinksSearchParamsSchema = CursorPaginationSchema.openapi(
	"GetLinksSearchParams",
);

export type ListLinksSearchParams = z.infer<typeof ListLinksSearchParamsSchema>;
export type LinksParams = z.infer<typeof LinksParamsSchema>;
