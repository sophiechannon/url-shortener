import { ClerkProvider } from "@clerk/react";
import { shadcn } from "@clerk/ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	// Available in route loaders as `context.queryClient`.
	context: { queryClient },
	// Let TanStack Query decide when data is stale, not the router.
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
	<StrictMode>
		<ClerkProvider
			routerPush={(to) => router.navigate({ href: to })}
			routerReplace={(to) => router.navigate({ href: to, replace: true })}
			afterSignOutUrl="/"
			appearance={{
				theme: shadcn,
				// Match the app's fonts (see --font-sans / --font-heading in index.css).
				variables: { fontFamily: '"Figtree Variable", sans-serif' },
				elements: { headerTitle: "font-heading text-lg font-medium" },
				options: { unsafe_disableDevelopmentModeWarnings: true },
			}}
		>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ClerkProvider>
	</StrictMode>,
);
