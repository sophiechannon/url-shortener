import { useListLinksSuspenseInfinite } from "@/api/generated";

export function useLinksInfinite() {
	const query = useListLinksSuspenseInfinite(
		{ limit: 10 },
		{
			query: {
				getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
			},
		},
	);
	const links = query.data.pages.flatMap((p) => p.data.items);
	return { links, ...query };
}
