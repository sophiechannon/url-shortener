import { HttpResponse, http } from "msw";
import type {
	CreateLink,
	Link,
	ListLinks200,
} from "@/api/generated/url-shortener-api.schemas";

export const API_URL = "http://api.test";

// A tiny in-memory backend so tests exercise the real request/refetch flow
// rather than canned one-off responses. Reset before every test in setup.ts.
export const db = {
	links: [] as Link[],
	reset() {
		this.links = [];
	},
	seed(count: number) {
		this.links = Array.from({ length: count }, (_, i) => ({
			shortUrl: `short-${i + 1}`,
			originalUrl: `https://example.com/${i + 1}`,
		}));
	},
};

export const handlers = [
	http.get(`${API_URL}/links`, ({ request }) => {
		const params = new URL(request.url).searchParams;
		const limit = Number(params.get("limit") ?? 25);
		const cursor = Number(params.get("cursor") ?? 0);
		const items = db.links.slice(cursor, cursor + limit);
		const next = cursor + limit;
		return HttpResponse.json<ListLinks200>({
			items,
			nextCursor: next < db.links.length ? next : null,
		});
	}),

	http.get(`${API_URL}/links/availability`, ({ request }) => {
		const shortUrl = new URL(request.url).searchParams.get("shortUrl");
		return HttpResponse.json(!db.links.some((l) => l.shortUrl === shortUrl));
	}),

	http.post<never, CreateLink>(`${API_URL}/links`, async ({ request }) => {
		const { originalUrl, alias } = await request.json();
		const shortUrl = alias ?? `gen${db.links.length + 1}`;
		if (db.links.some((l) => l.shortUrl === shortUrl)) {
			return HttpResponse.json(
				{ error: "Short URL already in use" },
				{ status: 409 },
			);
		}
		const link = { originalUrl, shortUrl };
		db.links.unshift(link);
		return HttpResponse.json<Link>(link, { status: 201 });
	}),

	http.delete<{ id: string }>(`${API_URL}/links/:id`, ({ params }) => {
		const link = db.links.find((l) => l.shortUrl === params.id);
		if (!link) {
			return HttpResponse.json({ error: "Link not found" }, { status: 404 });
		}
		db.links = db.links.filter((l) => l !== link);
		return HttpResponse.json<Link>(link);
	}),
];
