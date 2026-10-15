import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

const STORAGE_KEY = "vite-ui-theme";
const html = document.documentElement;

const renderToggle = () =>
	renderWithProviders(
		<ThemeProvider>
			<ModeToggle />
		</ThemeProvider>,
	);

const prefersDark = (dark: boolean) =>
	vi
		.mocked(window.matchMedia)
		.mockImplementation(
			(query) => ({ matches: dark, media: query }) as MediaQueryList,
		);

describe("ModeToggle", () => {
	it("follows the system theme by default", async () => {
		prefersDark(true);

		await renderToggle();

		expect(html).toHaveClass("dark");
	});

	it("restores the saved theme", async () => {
		localStorage.setItem(STORAGE_KEY, "light");
		prefersDark(true);

		await renderToggle();

		expect(html).toHaveClass("light");
		expect(html).not.toHaveClass("dark");
	});

	it.each([
		["Dark", "dark", "dark"],
		["Light", "light", "light"],
		["System", "system", "light"],
	])("switches to %s and remembers it", async (option, stored, applied) => {
		prefersDark(false);
		localStorage.setItem(STORAGE_KEY, "dark");
		const { user } = await renderToggle();

		await user.click(screen.getByRole("button", { name: "Toggle theme" }));
		await user.click(await screen.findByRole("menuitem", { name: option }));

		expect(html).toHaveClass(applied);
		expect(html.classList).toHaveLength(1);
		expect(localStorage.getItem(STORAGE_KEY)).toBe(stored);
	});
});
