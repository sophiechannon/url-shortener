import { screen, within } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { MyLinksCard } from "@/features/links-table";
import { auth, TEST_USER } from "@/test/clerk";
import { API_URL, db } from "@/test/handlers";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { CreateLinkCard } from "./create-link-card";

const renderCard = async () => {
	const result = await renderWithProviders(<CreateLinkCard />);
	await screen.findByText("Give it a go...");
	return result;
};

const submitButton = () => screen.getByRole("button", { name: "Submit" });

describe("CreateLinkCard", () => {
	it("creates a link and shows the result", async () => {
		const { user } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.click(submitButton());

		expect(
			await screen.findByText("Success! Your short URL..."),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Original URL")).toHaveValue(
			"https://example.com",
		);
		expect(screen.getByLabelText("Short URL")).toHaveValue(`${API_URL}/gen1`);
	});

	it("uses the alias when one is given", async () => {
		const { user, container } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.type(screen.getByLabelText("Alias"), "my-alias");
		await expect
			.poll(() => container.querySelector(".lucide-check"))
			.toBeTruthy();
		await user.click(submitButton());

		expect(await screen.findByLabelText("Short URL")).toHaveValue(
			`${API_URL}/my-alias`,
		);
		expect(db.links).toEqual([
			expect.objectContaining({
				originalUrl: "https://example.com",
				shortUrl: "my-alias",
			}),
		]);
	});

	it("goes back to an empty form after 'Create Another'", async () => {
		const { user } = await renderCard();
		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.click(submitButton());

		await user.click(
			await screen.findByRole("button", { name: "Create Another" }),
		);

		expect(await screen.findByText("Give it a go...")).toBeInTheDocument();
		expect(screen.getByLabelText(/URL/)).toHaveValue("");
		expect(screen.getByLabelText("Alias")).toHaveValue("");
	});

	it("marks the URL as required", async () => {
		await renderCard();

		const urlLabel = screen.getByText("URL").closest("label");
		expect(urlLabel).toHaveTextContent("*");
		expect(screen.getByText("Alias").closest("label")).not.toHaveTextContent(
			"*",
		);
	});

	it("rejects an invalid URL", async () => {
		const { user } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "not a url");

		expect(await screen.findByText("Enter a valid URL")).toBeInTheDocument();
		expect(submitButton()).toBeDisabled();
	});

	it("does not submit an empty form", async () => {
		const { user } = await renderCard();

		await user.click(submitButton());

		expect(await screen.findByText("Enter a valid URL")).toBeInTheDocument();
		expect(db.links).toHaveLength(0);
	});

	it("rejects a badly formatted alias without checking availability", async () => {
		let checked = false;
		server.use(
			http.get(`${API_URL}/links/availability`, () => {
				checked = true;
				return HttpResponse.json(true);
			}),
		);
		const { user } = await renderCard();

		await user.type(screen.getByLabelText("Alias"), "a!");

		expect(
			await screen.findByText("3-32 letters, numbers, - or _"),
		).toBeInTheDocument();
		expect(checked).toBe(false);
	});

	it("shows a tick when the alias is available", async () => {
		const { user, container } = await renderCard();

		await user.type(screen.getByLabelText("Alias"), "free");

		expect(
			await screen.findByRole("status", { name: "Loading" }),
		).toBeVisible();
		await expect
			.poll(() => container.querySelector(".lucide-check"))
			.toBeTruthy();
		expect(screen.queryByText("Not available")).not.toBeInTheDocument();
	});

	it("shows an error when the alias is taken", async () => {
		db.seed(1);
		const { user, container } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.type(screen.getByLabelText("Alias"), "short-1");

		expect(await screen.findByText("Not available")).toBeInTheDocument();
		expect(container.querySelector(".lucide-x")).toBeInTheDocument();
		expect(submitButton()).toBeDisabled();
	});

	it("only checks availability once typing pauses", async () => {
		const checked: string[] = [];
		server.use(
			http.get(`${API_URL}/links/availability`, ({ request }) => {
				checked.push(new URL(request.url).searchParams.get("shortUrl") ?? "");
				return HttpResponse.json(true);
			}),
		);
		const { user, container } = await renderCard();

		await user.type(screen.getByLabelText("Alias"), "abcdef");

		await expect
			.poll(() => container.querySelector(".lucide-check"))
			.toBeTruthy();
		expect(checked).toEqual(["abcdef"]);
	});

	it("shows an error if the alias is taken by the time it is submitted", async () => {
		server.use(
			http.post(`${API_URL}/links`, () =>
				HttpResponse.json(
					{ error: "Short URL already in use" },
					{ status: 409 },
				),
			),
		);
		const { user, container } = await renderCard();
		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.type(screen.getByLabelText("Alias"), "race");
		await expect
			.poll(() => container.querySelector(".lucide-check"))
			.toBeTruthy();

		await user.click(submitButton());

		expect(await screen.findByText("Not available")).toBeInTheDocument();
		expect(screen.getByText("Give it a go...")).toBeInTheDocument();
	});

	it("shows a toast when the link cannot be created", async () => {
		server.use(
			http.post(`${API_URL}/links`, () =>
				HttpResponse.json({ error: "Internal server error" }, { status: 500 }),
			),
		);
		const { user } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.click(submitButton());

		expect(
			await screen.findByText("There was a problem creating your link"),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/URL/)).toHaveValue("https://example.com");
	});

	it("creates links without an owner when signed out", async () => {
		const { user } = await renderCard();

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.click(submitButton());

		await screen.findByText("Success! Your short URL...");
		expect(db.links).toEqual([expect.objectContaining({ userId: null })]);
	});

	it("adds the new link to My Links when signed in", async () => {
		auth.signIn();
		const { user } = await renderWithProviders(
			<>
				<CreateLinkCard />
				<MyLinksCard />
			</>,
		);
		await screen.findByText("Shorten any URL...");
		await screen.findByText("You have no links yet, why not create one now?");

		await user.type(screen.getByLabelText(/URL/), "https://example.com");
		await user.click(submitButton());

		const table = await screen.findByRole("table");
		expect(
			await within(table).findByRole("link", { name: "https://example.com" }),
		).toBeInTheDocument();
		expect(db.links).toEqual([expect.objectContaining({ userId: TEST_USER })]);
	});
});
