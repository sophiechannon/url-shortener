import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { auth } from "@/test/clerk";
import { useClearQueriesOnUserChange } from "./use-clear-queries-on-user-change";

function setup() {
	const queryClient = new QueryClient();
	queryClient.setQueryData(["links"], ["cached"]);
	const wrapper = ({ children }: PropsWithChildren) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	const { rerender } = renderHook(() => useClearQueriesOnUserChange(), {
		wrapper,
	});
	return { queryClient, rerender };
}

describe("useClearQueriesOnUserChange", () => {
	it("keeps the cache while the user stays the same", () => {
		const { queryClient, rerender } = setup();

		rerender();

		expect(queryClient.getQueryData(["links"])).toEqual(["cached"]);
	});

	it("clears the cache on sign in", () => {
		const { queryClient, rerender } = setup();

		auth.signIn();
		rerender();

		expect(queryClient.getQueryData(["links"])).toBeUndefined();
	});

	it("clears the cache on sign out", () => {
		auth.signIn();
		const { queryClient, rerender } = setup();

		auth.signOut();
		rerender();

		expect(queryClient.getQueryData(["links"])).toBeUndefined();
	});
});
