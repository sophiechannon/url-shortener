import type { Link } from "@/api/generated/url-shortener-api.schemas";
import { localApi } from "@/features/create-link/components/link-result-card-content";
import type { LinkRow } from "../schemas/link-row";
import { useLinks } from "./queries/use-links";

export function useLinksTable() {
	const { links } = useLinks();
	const linkRows = mapLinksToLinkRow(links);
	return { linkRows };
}

function mapLinksToLinkRow(links: Link[]): LinkRow[] {
	return links.map((link) => ({
		originalUrl: link.originalUrl,
		shortUrl: { display: localApi + link.shortUrl, key: link.shortUrl },
	}));
}
