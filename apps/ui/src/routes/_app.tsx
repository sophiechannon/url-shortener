import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, ThemeProvider } from "@/components";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<ThemeProvider>
			<div className="flex h-dvh w-full flex-col overflow-hidden px-4">
				<SiteHeader />
				<div className="min-h-0 flex-1 overflow-auto py-4">
					<Outlet />
				</div>
			</div>
		</ThemeProvider>
	);
}
