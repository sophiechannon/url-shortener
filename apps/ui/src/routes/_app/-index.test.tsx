// The "-" prefix stops TanStack Router treating this file as a route.
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { db } from "@/test/handlers";
import { renderWithProviders } from "@/test/render";
import { Route } from "./index";

const HomePage = Route.options.component;
if (!HomePage) throw new Error("The home route has no component");

describe("HomePage", () => {
	it("offers sign in instead of My Links when signed out", async () => {
		await renderWithProviders(<HomePage />);

		expect(
			await screen.findByRole("tab", { name: "Sign In" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("Coming soon... signed out links").closest("[inert]"),
		).toBeNull();
		expect(screen.queryByText("My Links")).not.toBeInTheDocument();
	});

	it("shows the user's links when signed in", async () => {
		auth.signIn();
		db.seed(1);

		await renderWithProviders(<HomePage />);

		expect(
			await screen.findByRole("link", { name: "https://example.com/1" }),
		).toBeInTheDocument();
		expect(screen.getByText("My Links")).toBeInTheDocument();
		expect(
			screen.queryByRole("tab", { name: "Sign In" }),
		).not.toBeInTheDocument();
		// Stays mounted so it can animate closed; inert hides it from users.
		expect(
			screen.getByText("Coming soon... signed out links").closest("[inert]"),
		).not.toBeNull();
	});
});
