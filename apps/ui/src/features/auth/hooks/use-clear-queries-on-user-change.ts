import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

// Sign in/out no longer reloads the page, so drop cached data when the user
// changes. Otherwise the last user's links could show for the next one.
export function useClearQueriesOnUserChange() {
	const { userId } = useAuth();
	const queryClient = useQueryClient();
	const previousUserId = useRef(userId);

	useEffect(() => {
		// userId is undefined while Clerk loads, so the first resolve isn't a change.
		if (
			previousUserId.current !== undefined &&
			previousUserId.current !== userId
		) {
			queryClient.clear();
		}
		previousUserId.current = userId;
	}, [userId, queryClient]);
}
