import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AliasField } from "./alias-field";

const defaults = { onChange: () => {}, isPending: false, isValid: true };

describe("AliasField", () => {
	it("reports typed values", async () => {
		const onChange = vi.fn();
		render(<AliasField {...defaults} value="" onChange={onChange} />);

		await userEvent.type(screen.getByRole("textbox"), "a");

		expect(onChange).toHaveBeenCalledWith("a");
	});

	it("shows no status when empty", () => {
		const { container } = render(
			<AliasField {...defaults} value="" isPending />,
		);

		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(container.querySelector("svg")).not.toBeInTheDocument();
	});

	it("shows a spinner while checking", () => {
		render(<AliasField {...defaults} value="abc" isPending />);

		expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
	});

	it("shows a tick when the alias is valid", () => {
		const { container } = render(<AliasField {...defaults} value="abc" />);

		expect(container.querySelector(".lucide-check")).toBeInTheDocument();
	});

	it("shows a cross when the alias is invalid", () => {
		const { container } = render(
			<AliasField {...defaults} value="abc" isValid={false} />,
		);

		expect(container.querySelector(".lucide-x")).toBeInTheDocument();
	});
});
