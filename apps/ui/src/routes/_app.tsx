import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, ThemeProvider } from "@/components";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<ThemeProvider>
			<div className="flex h-dvh w-full flex-col overflow-hidden">
				<SiteHeader />
				<Outlet />
			</div>
		</ThemeProvider>
	);
}
