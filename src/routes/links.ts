import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const LinkSchema = z
	.object({
		originalUrl: z.string().openapi({ example: "https://google.com" }),
		shortUrl: z.string().openapi({ example: "fd7hj2" }),
	})
	.openapi("Link");

const CreateLinkSchema = z
	.object({
		originalUrl: z.url().openapi({ example: "https://google.com" }),
		alias: z.string().optional().openapi({ example: "goog" }),
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

export const links = new OpenAPIHono().openapi(postLink, (c) => {
	const { originalUrl, alias } = c.req.valid("json");
	return c.json({ originalUrl, shortUrl: alias ?? "fd7hj2" }, 201);
});
