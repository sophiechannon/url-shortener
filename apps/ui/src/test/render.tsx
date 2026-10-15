import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";

// Renders `ui` inside the same providers the app uses (query client, router,
// toaster). Resolves once the router has rendered the component.
export async function renderWithProviders(ui: ReactNode) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	const router = createRouter({
		routeTree: createRootRoute({ component: () => ui }),
		history: createMemoryHistory(),
	});
	const user = userEvent.setup();

	const result = render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster />
		</QueryClientProvider>,
	);
	await act(() => router.load());

	return { ...result, user, queryClient, router };
}
