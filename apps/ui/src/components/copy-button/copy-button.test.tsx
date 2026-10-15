import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
	it("copies the text to the clipboard", async () => {
		const { user } = await renderWithProviders(
			<CopyButton label="copy link" text="http://short/abc" />,
		);

		await user.click(await screen.findByRole("button", { name: "copy link" }));

		expect(await navigator.clipboard.readText()).toBe("http://short/abc");
	});

	it("briefly shows a confirmation icon after copying", async () => {
		const { user, container } = await renderWithProviders(
			<CopyButton label="copy link" text="http://short/abc" />,
		);
		expect(container.querySelector(".lucide-copy")).toBeInTheDocument();

		await user.click(await screen.findByRole("button", { name: "copy link" }));

		expect(container.querySelector(".lucide-copy-check")).toBeInTheDocument();
		await waitFor(() =>
			expect(container.querySelector(".lucide-copy")).toBeInTheDocument(),
		);
	});

	it("shows an error toast when copying fails", async () => {
		const { user, container } = await renderWithProviders(
			<CopyButton label="copy link" text="http://short/abc" />,
		);
		vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
			new Error("denied"),
		);

		await user.click(await screen.findByRole("button", { name: "copy link" }));

		expect(
			await screen.findByText("Failed to copy to clipboard"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".lucide-copy-check"),
		).not.toBeInTheDocument();
	});
});
