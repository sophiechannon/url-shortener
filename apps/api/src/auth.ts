import { verifyToken } from "@clerk/backend";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type AuthEnv = {
	Variables: {
		// The signed-in Clerk user, or null for anonymous requests.
		userId: string | null;
	};
};

// Reads the Clerk session token from `Authorization: Bearer <token>`. The UI
// sends it on every request, so there are no cookies to deal with when the API
// is on a different origin. A missing token is anonymous; a bad one is a 401.
export const clerkAuth = createMiddleware<AuthEnv>(async (c, next) => {
	const header = c.req.header("Authorization");
	if (!header) {
		c.set("userId", null);
		return next();
	}

	const token = header.match(/^Bearer (.+)$/)?.[1];
	if (!token) {
		throw new HTTPException(401, { message: "Invalid authorization header" });
	}

	try {
		const { sub } = await verifyToken(token, {
			secretKey: process.env.CLERK_SECRET_KEY,
		});
		c.set("userId", sub);
	} catch {
		throw new HTTPException(401, { message: "Invalid session token" });
	}

	return next();
});

export const requireUserId = (userId: string | null) => {
	if (!userId) {
		throw new HTTPException(401, { message: "Sign in required" });
	}
	return userId;
};
