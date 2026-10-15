import { describe, expect, it } from "vitest";
import { app } from "../app";
import { links } from "../db/schema";
import { testDb } from "../test/db";

describe("GET /:shortUrl", () => {
	it("redirects to the original URL", async () => {
		await testDb.insert(links).values({
			shortUrl: "goog",
			originalUrl: "https://google.com/search?q=hi",
		});

		const res = await app.request("/goog");

		expect(res.status).toBe(302);
		expect(res.headers.get("Location")).toBe("https://google.com/search?q=hi");
	});

	it("matches the short URL exactly", async () => {
		await testDb
			.insert(links)
			.values({ shortUrl: "goog", originalUrl: "https://google.com" });

		const res = await app.request("/GOOG");

		expect(res.status).toBe(404);
	});

	it("returns 404 for an unknown short URL", async () => {
		const res = await app.request("/nope");

		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({ error: "Not found" });
	});

	it.each(["/health", "/openapi.json", "/links"])(
		"does not shadow %s",
		async (path) => {
			// A link whose short URL matches a real route must not take it over.
			await testDb
				.insert(links)
				.values({ shortUrl: path.slice(1), originalUrl: "https://evil.com" });

			const res = await app.request(path);

			expect(res.status).toBe(200);
		},
	);
});
