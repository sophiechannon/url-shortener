import { useQueryClient } from "@tanstack/react-query";
import { getListLinksQueryKey, listLinks } from "@/api/generated";

/**
 * Returns a lazy checker: nothing is fetched until it's called with an alias.
 * Resolves to true when no link uses that alias. Network errors reject, so
 * callers can tell "couldn't check" apart from "taken".
 */
export function useCheckAliasAvailability() {
	const queryClient = useQueryClient();

	return async (alias: string, signal?: AbortSignal) => {
		const params = { shortUrl: alias, limit: 1 };
		const res = await queryClient.query({
			queryKey: getListLinksQueryKey(params),
			// Always hit the API: availability can change between checks.
			staleTime: 0,
			queryFn: (context) =>
				listLinks(params, { signal: signal ?? context.signal }),
		});
		return res.data.length === 0;
	};
}
