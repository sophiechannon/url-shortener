import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/toast";

type RouterContext = {
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	return (
		<>
			<main>
				<Outlet />
			</main>
			<Toaster />
			<ReactQueryDevtools buttonPosition="bottom-left" />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
