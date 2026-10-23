import { screen, waitFor, within } from "@testing-library/react";
import { delay, HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { API_URL, db } from "@/test/handlers";
import { mockIntersectionObserver } from "@/test/intersection-observer";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { MyLinksCard } from "./my-links-card";

let observer: ReturnType<typeof mockIntersectionObserver>;
beforeEach(() => {
	observer = mockIntersectionObserver();
	// The card is only shown to signed-in users, and GET /links requires it.
	auth.signIn();
});

// Data rows only, skipping the header row.
const dataRows = () => screen.getAllByRole("row").slice(1);

const renderLoaded = async () => {
	const result = await renderWithProviders(<MyLinksCard />);
	await waitFor(() =>
		expect(screen.getByRole("table")).not.toHaveAttribute("aria-busy"),
	);
	return result;
};

describe("MyLinksCard", () => {
	it("shows a skeleton while links load", async () => {
		server.use(
			http.get(`${API_URL}/links`, async () => {
				await delay("infinite");
			}),
		);

		await renderWithProviders(<MyLinksCard />);

		expect(await screen.findByRole("table")).toHaveAttribute(
			"aria-busy",
			"true",
		);
	});

	it("lists only the signed-in user's links", async () => {
		db.seed(2, "user_someone_else");

		await renderWithProviders(<MyLinksCard />);

		expect(
			await screen.findByText("You have no links yet, why not create one now?"),
		).toBeInTheDocument();
	});

	it("lists links with their short and original URLs", async () => {
		db.seed(2);

		await renderLoaded();

		const [first, second] = dataRows();
		expect(
			within(first).getByRole("link", {
				name: "http://localhost:3000/short-1",
			}),
		).toBeInTheDocument();
		expect(
			within(first).getByRole("link", { name: "https://example.com/1" }),
		).toBeInTheDocument();
		expect(
			within(second).getByRole("link", {
				name: "http://localhost:3000/short-2",
			}),
		).toBeInTheDocument();
	});

	it("shows the column headers", async () => {
		db.seed(1);

		await renderLoaded();

		expect(
			screen.getAllByRole("columnheader").map((h) => h.textContent),
		).toEqual(["Short URL", "Original URL", "Actions"]);
	});

	it("prompts to create a link when there are none", async () => {
		await renderWithProviders(<MyLinksCard />);

		expect(
			await screen.findByText("You have no links yet, why not create one now?"),
		).toBeInTheDocument();
		expect(screen.queryByRole("table")).not.toBeInTheDocument();
	});

	it("copies a link's short URL", async () => {
		db.seed(1);
		const { user } = await renderLoaded();

		await user.click(
			within(dataRows()[0]).getByRole("button", { name: "copy short URL" }),
		);

		expect(await navigator.clipboard.readText()).toBe(
			"http://localhost:3000/short-1",
		);
	});

	it("loads 10 links at a time and fetches more on scroll", async () => {
		db.seed(15);
		await renderLoaded();
		expect(dataRows()).toHaveLength(10);

		observer.intersect();

		await waitFor(() => expect(dataRows()).toHaveLength(15));
		expect(
			screen.queryByRole("status", { hidden: true }),
		).not.toBeInTheDocument();
	});

	it("shows an error when more links fail to load", async () => {
		db.seed(15);
		await renderLoaded();
		server.use(
			http.get(`${API_URL}/links`, () =>
				HttpResponse.json({ error: "Internal server error" }, { status: 500 }),
			),
		);

		observer.intersect();

		expect(await screen.findByText("Error fetching data")).toBeInTheDocument();
		expect(dataRows()).toHaveLength(10);
	});

	it("deletes a link", async () => {
		db.seed(2);
		const { user } = await renderLoaded();

		await user.click(
			within(dataRows()[0]).getByRole("button", { name: "delete link" }),
		);

		await waitFor(() => expect(dataRows()).toHaveLength(1));
		expect(
			screen.queryByText("http://localhost:3000/short-1"),
		).not.toBeInTheDocument();
		expect(db.links.map((l) => l.shortUrl)).toEqual(["short-2"]);
	});

	it("shows a toast when a link cannot be deleted", async () => {
		db.seed(1);
		server.use(
			http.delete(`${API_URL}/links/:id`, () =>
				HttpResponse.json({ error: "Internal server error" }, { status: 500 }),
			),
		);
		const { user } = await renderLoaded();

		await user.click(
			within(dataRows()[0]).getByRole("button", { name: "delete link" }),
		);

		expect(
			await screen.findByText("Link could not be deleted"),
		).toBeInTheDocument();
		expect(dataRows()).toHaveLength(1);
	});
});
