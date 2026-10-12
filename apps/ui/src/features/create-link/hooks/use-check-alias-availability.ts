import { useQueryClient } from "@tanstack/react-query";
import {
	checkAvailability,
	getCheckAvailabilityQueryKey,
} from "@/api/generated";

/**
 * Returns a lazy checker: nothing is fetched until it's called with an alias.
 * Resolves to true when no link uses that alias. Network errors reject, so
 * callers can tell "couldn't check" apart from "taken".
 */
export function useCheckAliasAvailability() {
	const queryClient = useQueryClient();

	return async (alias: string, signal?: AbortSignal) => {
		const params = { shortUrl: alias };
		const res = await queryClient.query({
			queryKey: getCheckAvailabilityQueryKey(params),
			// Always hit the API: availability can change between checks.
			staleTime: 0,
			queryFn: (context) =>
				checkAvailability(params, { signal: signal ?? context.signal }),
		});
		return res.data;
	};
}
