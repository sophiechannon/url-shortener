import { verifyWebhook } from "@clerk/backend/webhooks";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../db/client";
import { links as linksTable } from "../db/schema";

// Called by Clerk, not the UI, so it's a plain Hono route kept out of openapi.json.
// Signed with CLERK_WEBHOOK_SIGNING_SECRET, which verifyWebhook reads from the env.
export const webhooks = new Hono().post("/webhooks/clerk", async (c) => {
	let event: Awaited<ReturnType<typeof verifyWebhook>>;
	try {
		event = await verifyWebhook(c.req.raw);
	} catch {
		return c.json({ error: "Invalid webhook signature" }, 400);
	}

	// Deleting an account deletes its links, so nothing personal is left behind.
	if (event.type === "user.deleted" && event.data.id) {
		await getDb()
			.delete(linksTable)
			.where(eq(linksTable.userId, event.data.id));
	}

	return c.body(null, 204);
});
