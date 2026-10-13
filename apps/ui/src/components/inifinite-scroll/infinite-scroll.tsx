import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { Spinner } from "../ui/spinner";

interface InfiniteScrollProps {
	isFetchingNextPage: boolean;
	isFetchNextPageError: boolean;
	hasNextPage: boolean;
	fetchNextPage: () => unknown;
	threshold?: number;
	rootMargin?: string;
	children?: ReactNode;
	containerRef: RefObject<HTMLDivElement | null>;
}

export function InfiniteScroll({
	isFetchingNextPage,
	isFetchNextPageError,
	hasNextPage,
	fetchNextPage,
	threshold = 1,
	rootMargin = "0px",
	children,
	containerRef,
}: InfiniteScrollProps) {
	const loadMoreRef = useRef<HTMLDivElement>(null);

	// fetch more when the marker at the top comes into view
	useEffect(() => {
		const node = loadMoreRef.current;
		if (!node) {
			return;
		}

		const observer = new IntersectionObserver(
			async (entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					await fetchNextPage();
				}
			},
			{ root: containerRef.current, rootMargin, threshold },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [
		containerRef,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		rootMargin,
		threshold,
	]);

	return (
		<>
			{children}
			<div ref={loadMoreRef} />
			{isFetchNextPageError && <div>Error fetching data</div>}
			{hasNextPage && (
				<div className="w-full flex justify-center">
					<Spinner
						className={`${isFetchingNextPage ? "visible" : "invisible"} my-2 text-primary size-5 shrink-0`}
					/>
				</div>
			)}
		</>
	);
}
