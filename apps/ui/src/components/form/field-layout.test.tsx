import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldLayout } from "./field-layout";

describe("FieldLayout", () => {
	it("labels its input", () => {
		render(
			<FieldLayout label="Name" fieldName="name">
				<input id="name" />
			</FieldLayout>,
		);

		expect(screen.getByLabelText("Name")).toBeInTheDocument();
	});

	it("marks required fields", () => {
		render(
			<FieldLayout label="Name" fieldName="name" required>
				<input id="name" />
			</FieldLayout>,
		);

		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("does not mark optional fields", () => {
		render(
			<FieldLayout label="Name" fieldName="name">
				<input id="name" />
			</FieldLayout>,
		);

		expect(screen.queryByText("*")).not.toBeInTheDocument();
	});

	it("shows errors when invalid", () => {
		render(
			<FieldLayout
				label="Name"
				fieldName="name"
				isInvalid
				errors={[{ message: "Too short" }]}
			>
				<input id="name" />
			</FieldLayout>,
		);

		expect(screen.getByText("Too short")).toBeInTheDocument();
	});

	it("hides errors when not invalid", () => {
		render(
			<FieldLayout
				label="Name"
				fieldName="name"
				isInvalid={false}
				errors={[{ message: "Too short" }]}
			>
				<input id="name" />
			</FieldLayout>,
		);

		expect(screen.queryByText("Too short")).not.toBeInTheDocument();
	});
});
