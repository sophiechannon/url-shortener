import type { Link } from "@/api/generated/url-shortener-api.schemas";
import { shortLinkBaseUrl } from "@/lib/api-url";
import type { LinkRow } from "../schemas/link-row";
import { useLinksInfinite } from "./queries/use-links-inifinte";

export function useLinksTable() {
	const {
		links,
		fetchNextPage,
		hasNextPage,
		isFetchNextPageError,
		isFetchingNextPage,
	} = useLinksInfinite();
	const linkRows = mapLinksToLinkRow(links);
	return {
		linkRows,
		fetchNextPage,
		hasNextPage,
		isFetchNextPageError,
		isFetchingNextPage,
	};
}

function mapLinksToLinkRow(links: Link[]): LinkRow[] {
	return links.map((link) => ({
		originalUrl: link.originalUrl,
		shortUrl: { display: shortLinkBaseUrl + link.shortUrl, key: link.shortUrl },
	}));
}
