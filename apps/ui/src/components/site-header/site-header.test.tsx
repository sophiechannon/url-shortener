import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
	it("links the title to the home page", async () => {
		await renderWithProviders(<SiteHeader />);

		const title = await screen.findByRole("heading", { name: "URL SHORTENER" });
		expect(title.closest("a")).toHaveAttribute("href", "/");
	});

	it("has a theme toggle", async () => {
		await renderWithProviders(<SiteHeader />);

		expect(
			await screen.findByRole("button", { name: "Toggle theme" }),
		).toBeInTheDocument();
	});

	it("shows sign in and sign up buttons when signed out", async () => {
		await renderWithProviders(<SiteHeader />);

		expect(
			await screen.findByRole("button", { name: "Sign in" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
	});
});
