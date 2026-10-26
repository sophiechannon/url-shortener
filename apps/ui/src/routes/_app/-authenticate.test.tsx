// The "-" prefix stops TanStack Router treating this file as a route.
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { renderWithProviders } from "@/test/render";
import { Route } from "./authenticate";

const AuthenticatePage = Route.options.component;
if (!AuthenticatePage)
	throw new Error("The authenticate route has no component");

describe("AuthenticatePage", () => {
	it("offers sign in and sign up when signed out", async () => {
		await renderWithProviders(<AuthenticatePage />);

		expect(
			await screen.findByRole("tab", { name: "Sign In" }),
		).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Sign Up" })).toBeInTheDocument();
	});

	it("sends signed in users home", async () => {
		auth.signIn();

		const { router } = await renderWithProviders(<AuthenticatePage />);

		await waitFor(() => expect(router.state.location.pathname).toBe("/"));
		expect(
			screen.queryByRole("tab", { name: "Sign In" }),
		).not.toBeInTheDocument();
	});
});
