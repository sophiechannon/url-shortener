import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { API_URL } from "@/test/handlers";
import { server } from "@/test/server";
import { customFetch } from "./fetcher";

// Records the Authorization header of the next request to /echo.
const captureAuthHeader = () => {
	const seen: { authorization: string | null } = { authorization: null };
	server.use(
		http.get(`${API_URL}/echo`, ({ request }) => {
			seen.authorization = request.headers.get("Authorization");
			return HttpResponse.json({});
		}),
	);
	return seen;
};

describe("customFetch", () => {
	it("sends the Clerk session token when signed in", async () => {
		auth.signIn("user_alice");
		const seen = captureAuthHeader();

		await customFetch("/echo", {});

		expect(seen.authorization).toBe("Bearer user_alice");
	});

	it("sends no Authorization header when signed out", async () => {
		const seen = captureAuthHeader();

		await customFetch("/echo", {});

		expect(seen.authorization).toBeNull();
	});

	it("keeps the headers it was given", async () => {
		auth.signIn();
		let contentType: string | null = null;
		server.use(
			http.post(`${API_URL}/echo`, ({ request }) => {
				contentType = request.headers.get("Content-Type");
				return HttpResponse.json({});
			}),
		);

		await customFetch("/echo", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
		});

		expect(contentType).toBe("application/json");
	});
});
