import type { z } from "@hono/zod-openapi";
import Sqids from "sqids";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { links } from "../db/schema";
import type { LinkSchema, ListLinksSchema } from "../schema";
import { testDb } from "../test/db";

type Link = z.infer<typeof LinkSchema>;
type ListLinks = z.infer<typeof ListLinksSchema>;

const sqids = new Sqids({ minLength: 6 });

const seedLinks = (count: number) =>
	testDb
		.insert(links)
		.values(
			Array.from({ length: count }, (_, i) => ({
				shortUrl: `link-${i + 1}`,
				originalUrl: `https://example.com/${i + 1}`,
			})),
		)
		.returning();

// Store aliases matching the short URLs that would be generated for `ids`.
// Explicit high ids keep the id sequence untouched.
const claimGeneratedShortUrls = (ids: number[]) =>
	testDb.insert(links).values(
		ids.map((id, i) => ({
			id: 1000 + i,
			shortUrl: sqids.encode([id]),
			originalUrl: "https://claimed.com",
		})),
	);

const getLinks = async (query = "") =>
	(await (await app.request(`/links${query}`)).json()) as ListLinks;

const postLink = (body: unknown) =>
	app.request("/links", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

describe("GET /links", () => {
	it("returns an empty page when there are no links", async () => {
		const res = await app.request("/links");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ items: [], nextCursor: null });
	});

	it("returns links newest first without exposing internal fields", async () => {
		await seedLinks(3);

		const res = await app.request("/links");

		expect(await res.json()).toEqual({
			items: [
				{ shortUrl: "link-3", originalUrl: "https://example.com/3" },
				{ shortUrl: "link-2", originalUrl: "https://example.com/2" },
				{ shortUrl: "link-1", originalUrl: "https://example.com/1" },
			],
			nextCursor: null,
		});
	});

	it("defaults to a page size of 25", async () => {
		await seedLinks(30);

		const body = await getLinks();

		expect(body.items).toHaveLength(25);
		expect(body.nextCursor).toBe(6);
	});

	it("returns a cursor to the next page when there are more links", async () => {
		await seedLinks(5);

		const body = await getLinks("?limit=2");

		expect(body.items.map((l) => l.shortUrl)).toEqual(["link-5", "link-4"]);
		expect(body.nextCursor).toBe(4);
	});

	it("returns no cursor when the page is exactly full", async () => {
		await seedLinks(2);

		const body = await getLinks("?limit=2");

		expect(body.items).toHaveLength(2);
		expect(body.nextCursor).toBeNull();
	});

	it("pages through every link exactly once using the cursor", async () => {
		await seedLinks(5);
		const seen: string[] = [];
		let cursor: number | null = null;

		do {
			const query: string = cursor ? `&cursor=${cursor}` : "";
			const body = await getLinks(`?limit=2${query}`);
			seen.push(...body.items.map((l) => l.shortUrl));
			cursor = body.nextCursor;
		} while (cursor);

		expect(seen).toEqual(["link-5", "link-4", "link-3", "link-2", "link-1"]);
	});

	it.each([
		["0", "below the minimum"],
		["101", "above the maximum"],
		["abc", "not a number"],
		["1.5", "not an integer"],
	])("rejects limit=%s (%s)", async (limit) => {
		const res = await app.request(`/links?limit=${limit}`);

		expect(res.status).toBe(400);
		expect(await res.json()).toMatchObject({ error: "Validation failed" });
	});
});

describe("GET /links/availability", () => {
	it("returns true when the short URL is unused", async () => {
		const res = await app.request("/links/availability?shortUrl=free");

		expect(res.status).toBe(200);
		expect(await res.json()).toBe(true);
	});

	it("returns false when the short URL is taken", async () => {
		await seedLinks(1);

		const res = await app.request("/links/availability?shortUrl=link-1");

		expect(await res.json()).toBe(false);
	});

	it("requires a shortUrl", async () => {
		const res = await app.request("/links/availability");

		expect(res.status).toBe(400);
	});
});

describe("POST /links", () => {
	it("creates a link with a generated short URL", async () => {
		const res = await postLink({ originalUrl: "https://example.com" });

		expect(res.status).toBe(201);
		const body = (await res.json()) as Link;
		expect(body).toEqual({
			originalUrl: "https://example.com",
			shortUrl: sqids.encode([1]),
		});
		expect(body.shortUrl.length).toBeGreaterThanOrEqual(6);
	});

	it("generates a different short URL for each link", async () => {
		const first = (await (
			await postLink({ originalUrl: "https://example.com" })
		).json()) as Link;
		const second = (await (
			await postLink({ originalUrl: "https://example.com" })
		).json()) as Link;

		expect(first.shortUrl).not.toBe(second.shortUrl);
	});

	it("uses the alias as the short URL when one is given", async () => {
		const res = await postLink({
			originalUrl: "https://example.com",
			alias: "my_alias-1",
		});

		expect(res.status).toBe(201);
		expect(await res.json()).toEqual({
			originalUrl: "https://example.com",
			shortUrl: "my_alias-1",
		});
	});

	it("persists the link", async () => {
		await postLink({ originalUrl: "https://example.com", alias: "saved" });

		const rows = await testDb.select().from(links);

		expect(rows).toEqual([
			expect.objectContaining({
				shortUrl: "saved",
				originalUrl: "https://example.com",
			}),
		]);
	});

	it("returns 409 when the alias is already in use", async () => {
		await postLink({ originalUrl: "https://one.com", alias: "taken" });

		const res = await postLink({
			originalUrl: "https://two.com",
			alias: "taken",
		});

		expect(res.status).toBe(409);
		expect(await res.json()).toEqual({ error: "Short URL already in use" });
		expect(await testDb.select().from(links)).toHaveLength(1);
	});

	it("skips to the next id when a generated short URL is already an alias", async () => {
		await claimGeneratedShortUrls([1]);

		const res = await postLink({ originalUrl: "https://example.com" });

		expect(res.status).toBe(201);
		expect(await res.json()).toEqual({
			originalUrl: "https://example.com",
			shortUrl: sqids.encode([2]),
		});
	});

	it("keeps generating short URLs in id order after skipping one", async () => {
		await claimGeneratedShortUrls([1]);

		await postLink({ originalUrl: "https://one.com" });
		const res = await postLink({ originalUrl: "https://two.com" });

		expect(((await res.json()) as Link).shortUrl).toBe(sqids.encode([3]));
	});

	it("gives up with 409 after repeated collisions", async () => {
		await claimGeneratedShortUrls([1, 2, 3]);

		const res = await postLink({ originalUrl: "https://example.com" });

		expect(res.status).toBe(409);
		expect(await testDb.select().from(links)).toHaveLength(3);
	});

	it("does not retry when the alias is taken", async () => {
		await postLink({ originalUrl: "https://one.com", alias: "taken" });
		await postLink({ originalUrl: "https://two.com", alias: "taken" });

		const res = await postLink({ originalUrl: "https://three.com" });

		// Ids 1 and 2 were used by the two alias attempts; no extra ids were burned.
		expect(((await res.json()) as Link).shortUrl).toBe(sqids.encode([3]));
	});

	it.each<[unknown, string]>([
		[{}, "missing originalUrl"],
		[{ originalUrl: "not a url" }, "invalid originalUrl"],
		[{ originalUrl: "https://example.com", alias: "ab" }, "alias too short"],
		[
			{ originalUrl: "https://example.com", alias: "a".repeat(33) },
			"alias too long",
		],
		[
			{ originalUrl: "https://example.com", alias: "has space" },
			"alias with invalid characters",
		],
	])("rejects %j (%s)", async (body) => {
		const res = await postLink(body);

		expect(res.status).toBe(400);
		expect(await res.json()).toMatchObject({ error: "Validation failed" });
		expect(await testDb.select().from(links)).toHaveLength(0);
	});
});

describe("DELETE /links/:id", () => {
	it("deletes the link by short URL and returns it", async () => {
		await seedLinks(2);

		const res = await app.request("/links/link-1", { method: "DELETE" });

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			shortUrl: "link-1",
			originalUrl: "https://example.com/1",
		});
		const remaining = await testDb.select().from(links);
		expect(remaining.map((l) => l.shortUrl)).toEqual(["link-2"]);
	});

	it("returns 404 when the link does not exist", async () => {
		const res = await app.request("/links/missing", { method: "DELETE" });

		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({ error: "Link not found" });
	});
});
