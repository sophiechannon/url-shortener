import { OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { health } from "./routes/health";
import { links } from "./routes/links";
import { redirect } from "./routes/redirect";

export const ErrorSchema = z
	.object({ error: z.string(), details: z.unknown().optional() })
	.openapi("Error");

export const app = new OpenAPIHono({
	// Shape validation failures consistently across every route.
	defaultHook: (result, c) => {
		if (!result.success) {
			return c.json(
				{ error: "Validation failed", details: z.treeifyError(result.error) },
				400,
			);
		}
	},
});

app.route("/", health);
app.route("/", links);

export const openApiConfig = {
	openapi: "3.0.0",
	info: { title: "URL Shortener API", version: "0.1.0" },
};

app.doc("/openapi.json", openApiConfig);

// Registered last so `GET /{shortUrl}` doesn't swallow /health, /openapi.json, etc.
app.route("/", redirect);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json({ error: err.message }, err.status);
	}
	console.error(err);
	return c.json({ error: "Internal server error" }, 500);
});
