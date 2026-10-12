import { useListLinksSuspense } from "@/api/generated";

export function useLinks() {
	const query = useListLinksSuspense();
	const links = query.data.data;
	return { links, ...query };
}
