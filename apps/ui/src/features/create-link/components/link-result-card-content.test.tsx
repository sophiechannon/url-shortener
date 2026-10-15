import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { LinkResultCard } from "./link-result-card-content";

const renderCard = async () => {
	const resetUrls = vi.fn();
	const result = await renderWithProviders(
		<LinkResultCard
			originalUrl="https://example.com/long"
			shortUrl="abc123"
			resetUrls={resetUrls}
		/>,
	);
	return { resetUrls, ...result };
};

describe("LinkResultCard", () => {
	it("shows the original and full short URL", async () => {
		await renderCard();

		expect(await screen.findByLabelText("Original URL")).toHaveValue(
			"https://example.com/long",
		);
		expect(screen.getByLabelText("Short URL")).toHaveValue(
			"http://localhost:3000/abc123",
		);
	});

	it("copies the full short URL", async () => {
		const { user } = await renderCard();

		await user.click(
			await screen.findByRole("button", { name: "copy short URL" }),
		);

		expect(await navigator.clipboard.readText()).toBe(
			"http://localhost:3000/abc123",
		);
	});

	it("starts over when 'Create Another' is clicked", async () => {
		const { user, resetUrls } = await renderCard();

		await user.click(
			await screen.findByRole("button", { name: "Create Another" }),
		);

		expect(resetUrls).toHaveBeenCalledOnce();
	});
});
