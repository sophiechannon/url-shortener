import { HttpResponse, http } from "msw";
import type {
	CreateLink,
	Link,
	ListLinks200,
} from "@/api/generated/url-shortener-api.schemas";
import { TEST_USER } from "./clerk";

export const API_URL = "http://api.test";

// Mirrors a row in the API's links table.
type StoredLink = Link & { id: number; userId: string | null };

// A tiny in-memory backend so tests exercise the real request/refetch flow
// rather than canned one-off responses. Reset before every test in setup.ts.
export const db = {
	links: [] as StoredLink[],
	nextId: 1,
	reset() {
		this.links = [];
		this.nextId = 1;
	},
	// short-1 is the newest link, so it is listed first.
	seed(count: number, userId: string | null = TEST_USER) {
		this.links = Array.from({ length: count }, (_, i) => ({
			id: count - i,
			shortUrl: `short-${i + 1}`,
			originalUrl: `https://example.com/${i + 1}`,
			userId,
		}));
		this.nextId = count + 1;
	},
};

const toLink = ({ shortUrl, originalUrl }: StoredLink): Link => ({
	shortUrl,
	originalUrl,
});

// Like the API, the signed-in user comes from the bearer token (the Clerk mock
// uses the user id as the token). No header means signed out.
const userIdFrom = (request: Request) =>
	request.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1] ?? null;

const signInRequired = () =>
	HttpResponse.json({ error: "Sign in required" }, { status: 401 });

export const handlers = [
	http.get(`${API_URL}/links`, ({ request }) => {
		const userId = userIdFrom(request);
		if (!userId) return signInRequired();

		const params = new URL(request.url).searchParams;
		const limit = Number(params.get("limit") ?? 25);
		const cursor = params.get("cursor");
		// The cursor is the id of the last link on the previous page, newest first.
		const matching = db.links
			.filter((l) => l.userId === userId)
			.filter((l) => !cursor || l.id < Number(cursor))
			.sort((a, b) => b.id - a.id);
		const page = matching.slice(0, limit);
		return HttpResponse.json<ListLinks200>({
			items: page.map(toLink),
			nextCursor: matching.length > limit ? (page.at(-1)?.id ?? null) : null,
		});
	}),

	http.get(`${API_URL}/links/availability`, ({ request }) => {
		const shortUrl = new URL(request.url).searchParams.get("shortUrl");
		return HttpResponse.json(!db.links.some((l) => l.shortUrl === shortUrl));
	}),

	http.post<never, CreateLink>(`${API_URL}/links`, async ({ request }) => {
		const { originalUrl, alias } = await request.json();
		// Ids are never reused, so generated short URLs stay unique after deletes.
		const id = db.nextId++;
		const shortUrl = alias ?? `gen${id}`;
		if (db.links.some((l) => l.shortUrl === shortUrl)) {
			return HttpResponse.json(
				{ error: "Short URL already in use" },
				{ status: 409 },
			);
		}
		const link = { id, originalUrl, shortUrl, userId: userIdFrom(request) };
		db.links.push(link);
		return HttpResponse.json<Link>(toLink(link), { status: 201 });
	}),

	http.delete<{ id: string }>(`${API_URL}/links/:id`, ({ request, params }) => {
		const userId = userIdFrom(request);
		if (!userId) return signInRequired();

		const link = db.links.find(
			(l) => l.shortUrl === params.id && l.userId === userId,
		);
		if (!link) {
			return HttpResponse.json({ error: "Link not found" }, { status: 404 });
		}
		db.links = db.links.filter((l) => l !== link);
		return HttpResponse.json<Link>(toLink(link));
	}),
];
