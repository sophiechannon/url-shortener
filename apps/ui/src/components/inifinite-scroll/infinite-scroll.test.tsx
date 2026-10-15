import { render, screen } from "@testing-library/react";
import { type ComponentProps, createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockIntersectionObserver } from "@/test/intersection-observer";
import { InfiniteScroll } from "./infinite-scroll";

let observer: ReturnType<typeof mockIntersectionObserver>;
beforeEach(() => {
	observer = mockIntersectionObserver();
});

const renderScroll = (
	props: Partial<ComponentProps<typeof InfiniteScroll>> = {},
) => {
	const fetchNextPage = vi.fn();
	render(
		<InfiniteScroll
			containerRef={createRef()}
			hasNextPage
			isFetchingNextPage={false}
			isFetchNextPageError={false}
			fetchNextPage={fetchNextPage}
			{...props}
		>
			<p>content</p>
		</InfiniteScroll>,
	);
	return { fetchNextPage };
};

describe("InfiniteScroll", () => {
	it("renders its children", () => {
		renderScroll();

		expect(screen.getByText("content")).toBeInTheDocument();
	});

	it("fetches the next page when the end comes into view", () => {
		const { fetchNextPage } = renderScroll();

		observer.intersect();

		expect(fetchNextPage).toHaveBeenCalledOnce();
	});

	it("does not fetch while the end is out of view", () => {
		const { fetchNextPage } = renderScroll();

		observer.intersect(false);

		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("does not fetch when there are no more pages", () => {
		const { fetchNextPage } = renderScroll({ hasNextPage: false });

		observer.intersect();

		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("does not fetch while a page is already loading", () => {
		const { fetchNextPage } = renderScroll({ isFetchingNextPage: true });

		observer.intersect();

		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("shows the spinner only while loading the next page", () => {
		renderScroll({ isFetchingNextPage: true });

		expect(screen.getByRole("status", { name: "Loading" })).toHaveClass(
			"visible",
		);
	});

	it("keeps the spinner hidden between loads", () => {
		renderScroll();

		expect(screen.getByRole("status", { hidden: true })).toHaveClass(
			"invisible",
		);
	});

	it("has no spinner once every page is loaded", () => {
		renderScroll({ hasNextPage: false });

		expect(
			screen.queryByRole("status", { hidden: true }),
		).not.toBeInTheDocument();
	});

	it("shows an error when the next page fails to load", () => {
		renderScroll({ isFetchNextPageError: true });

		expect(screen.getByText("Error fetching data")).toBeInTheDocument();
	});
});
