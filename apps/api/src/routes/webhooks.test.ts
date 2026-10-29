import { describe, expect, it, vi } from "vitest";
import { app } from "../app";
import { links } from "../db/schema";
import { testDb } from "../test/db";

// The request body is the event; the `svix-signature` header stands in for a
// valid signature.
vi.mock("@clerk/backend/webhooks", () => ({
	verifyWebhook: async (request: Request) => {
		if (request.headers.get("svix-signature") !== "valid") {
			throw new Error("Invalid signature");
		}
		return request.json();
	},
}));

const postWebhook = (event: unknown, signature = "valid") =>
	app.request("/webhooks/clerk", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"svix-signature": signature,
		},
		body: JSON.stringify(event),
	});

const seed = () =>
	testDb.insert(links).values([
		{
			shortUrl: "alice-1",
			originalUrl: "https://a.com/1",
			userId: "user_alice",
		},
		{
			shortUrl: "alice-2",
			originalUrl: "https://a.com/2",
			userId: "user_alice",
		},
		{ shortUrl: "bob-1", originalUrl: "https://b.com/1", userId: "user_bob" },
	]);

const remainingShortUrls = async () =>
	(await testDb.select().from(links)).map((link) => link.shortUrl).sort();

describe("POST /webhooks/clerk", () => {
	it("deletes the user's links when their account is deleted", async () => {
		await seed();

		const res = await postWebhook({
			type: "user.deleted",
			data: { id: "user_alice", deleted: true },
		});

		expect(res.status).toBe(204);
		expect(await remainingShortUrls()).toEqual(["bob-1"]);
	});

	it("ignores other events", async () => {
		await seed();

		const res = await postWebhook({
			type: "user.updated",
			data: { id: "user_alice" },
		});

		expect(res.status).toBe(204);
		expect(await remainingShortUrls()).toEqual(["alice-1", "alice-2", "bob-1"]);
	});

	it("rejects requests without a valid signature", async () => {
		await seed();

		const res = await postWebhook(
			{ type: "user.deleted", data: { id: "user_alice", deleted: true } },
			"forged",
		);

		expect(res.status).toBe(400);
		expect(await remainingShortUrls()).toEqual(["alice-1", "alice-2", "bob-1"]);
	});
});
