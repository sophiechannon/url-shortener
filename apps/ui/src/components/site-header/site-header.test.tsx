import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { renderWithProviders } from "@/test/render";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
	it("links the title to the home page", async () => {
		await renderWithProviders(<SiteHeader />);

		const title = await screen.findByRole("heading", {
			name: "URL LENGTHENER",
		});
		expect(title.closest("a")).toHaveAttribute("href", "/");
	});

	it("has a theme toggle", async () => {
		await renderWithProviders(<SiteHeader />);

		expect(
			await screen.findByRole("button", { name: "Toggle theme" }),
		).toBeInTheDocument();
	});

	it("links to the authenticate page when signed out", async () => {
		await renderWithProviders(<SiteHeader />);

		expect(
			await screen.findByRole("link", { name: "Sign in" }),
		).toHaveAttribute("href", "/authenticate");
		expect(
			screen.queryByRole("button", { name: "User menu" }),
		).not.toBeInTheDocument();
	});

	it("shows the user menu instead when signed in", async () => {
		auth.signIn();

		await renderWithProviders(<SiteHeader />);

		expect(
			await screen.findByRole("button", { name: "User menu" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: "Sign in" }),
		).not.toBeInTheDocument();
	});
});
