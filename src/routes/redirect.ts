import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { getDb } from "../db/client";
import { links } from "../db/schema";

const getRedirect = createRoute({
	method: "get",
	path: "/{shortUrl}",
	operationId: "getRedirect",
	tags: ["links"],
	request: {
		params: z.object({
			shortUrl: z.string().openapi({ example: "fd7hj2" }),
		}),
	},
	responses: {
		302: { description: "Redirects to the original URL" },
	},
});

export const redirect = new OpenAPIHono().openapi(getRedirect, async (c) => {
	const { shortUrl } = c.req.valid("param");

	const [link] = await getDb()
		.select({ originalUrl: links.originalUrl })
		.from(links)
		.where(eq(links.shortUrl, shortUrl))
		.limit(1);

	if (!link) {
		throw new HTTPException(404, { message: "Not found" });
	}

	return c.redirect(link.originalUrl, 302);
});
