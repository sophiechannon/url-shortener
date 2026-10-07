import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const HealthSchema = z.object({ status: z.literal("ok") }).openapi("Health");

const getHealth = createRoute({
	method: "get",
	path: "/health",
	operationId: "getHealth",
	tags: ["health"],
	responses: {
		200: {
			description: "Service is healthy",
			content: { "application/json": { schema: HealthSchema } },
		},
	},
});

export const health = new OpenAPIHono().openapi(getHealth, (c) =>
	c.json({ status: "ok" as const }, 200),
);
